'use strict';

const Promise = require('bluebird');
const seqIdTrack = require('./../mongo/models/seqIdAggregated');
const config = require('./../config/config').globalConfig;
const aggregation = require('./../mongo/models/aggregation');
const source = require('./../mongo/models/source');
const debug = require('./../util/debug')('aggregation');
const seqId = require('./../mongo/models/seqIdCount');
const isequal = require('lodash.isequal');
const defaultChunkSize = 1000;

module.exports = function (aggregateDB) {
    debug.trace('get common ids');
    var conf = config.aggregation[aggregateDB];
    if (!conf) return Promise.reject(new Error(`No aggregation configuration for ${aggregateDB}`));


    var sourceNames = Object.keys(conf.sources);
    var maxSeqIds = {};
    var commonIdsSet;
    var chunkSize = conf.chunkSize || defaultChunkSize;
    

    return Promise.coroutine(function * () {
        do {
            let seqIds = yield seqIdTrack.getLastSeqIds(aggregateDB);
            seqIds = seqIds || {};
            let commonIds = [];

            for (let i = 0; i < sourceNames.length; i++) {
                let sourceName = sourceNames[i];
                //maxSeqIds[sourceName] = (yield source.getLastSeqId(sourceName)).sequentialID;
                let firstSeqId = seqIds[sourceName] || 0;
                let lastSeqId = firstSeqId + chunkSize;
                maxSeqIds[sourceName] = Math.min(lastSeqId, (yield source.getLastSeqId(sourceName)).sequentialID);
                let cids = yield source.getCommonIds(sourceName, firstSeqId, lastSeqId);
                cids = cids.map(commonId => commonId.commonID);
                commonIds = commonIds.concat(cids);
            }

            commonIdsSet = new Set(commonIds);

            for (let commonId of commonIdsSet) {
                let data = {};
                for (let i = 0; i < sourceNames.length; i++) {
                    let sourceName = sourceNames[i];
                    data[sourceName] = yield source.getByCommonId(sourceName, commonId);
                }
                var exists = checkExists(data);
                let obj = {};
                obj.id = commonId;
                obj._id = commonId;
                obj.date = Date.now();
                if (!exists) {
                    obj.action = 'delete';
                    obj.value = null;
                } else {
                    // aggregate will return null if config scripts decided
                    // it should not be saved
                    obj.value = yield aggregate(data, conf.sources, commonId);
                    if (obj.value === null) {
                        obj.action = 'delete';
                    } else {
                        obj.action = 'update';
                    }
                }

                let oldEntry = yield aggregation.findById(aggregateDB, commonId);
                if(!oldEntry && obj.action === 'delete') {
                    // Nothing to do, the data was deleted from sources and does not
                    // exist or was deleted in aggregation
                    debug.trace(`Ignoring ${aggregateDB}:${commonId}, which ought to be deleted but does not exist or was already deleted`);
                    continue;
                }
                oldEntry = oldEntry || {};
                if (isequal(obj.value, oldEntry.value)) {
                    // Don't save if has not changed
                    debug.trace(`Not saving ${aggregateDB}:${commonId} because has not changed`);
                } else {
                    // Save with next seqid
                    debug.trace(`Saving ${aggregateDB}:${commonId} with new seqid`);
                    obj.seqid = yield seqId.getNextSequenceID('aggregation_' + aggregateDB);
                    yield aggregation.save(aggregateDB, obj);
                }
            }
            yield seqIdTrack.setSeqIds(aggregateDB, maxSeqIds);
        } while (commonIdsSet.size);
    })();
};

function checkExists(data) {
    for (let source in data) {
        if (data[source].length !== 0) {
            return true;
        }
    }
    return false;
}

var aggregate = Promise.coroutine(function*aggregate(data, filter, commonId) {
    var result = {};
    var accept = true;
    for (var key in filter) {
        if (data[key]) {
            accept = yield Promise.resolve(filter[key].call(
                null,
                data[key].map(d => d.data),
                result,
                commonId,
                data[key].map(d => d._id)));

            if (accept === false) {
                break;
            }
        }
    }
    if (accept === false) {
        return null;
    }
    return result;
});
