'use strict';

const Promise = require('bluebird');
const seqIdTrack = require('./../mongo/models/seqIdAggregated');
const config = require('./../config/config').globalConfig;
const aggregation = require('./../mongo/models/aggregation');
const source = require('./../mongo/models/source');
const debug = require('./../util/debug')('aggregation');
const seqId = require('./../mongo/models/seqIdCount');
const connection = require('../mongo/connection');
const isequal = require('lodash.isequal');
const chunkSize = 1000;

module.exports = function (aggregateDB) {
    debug.trace('get common ids');
    var conf = config.aggregation[aggregateDB];
    if (!conf) return Promise.reject(new Error(`No aggregation configuration for ${aggregateDB}`));


    var sourceNames = Object.keys(conf.sources);
    var maxSeqIds = {};
    var commonIdsSet;


    return Promise.coroutine(function * () {
        yield connection();

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
                let obj = {};
                obj.id = commonId;
                obj._id = commonId;
                obj.action = 'update';
                obj.date = Date.now();
                obj.value = aggregate(data, conf.sources);

                if (obj.value === null) return;

                let oldEntry = yield aggregation.findById(aggregateDB, commonId);
                oldEntry = oldEntry || {};
                //console.log('old entry ' + oldEntry.id, oldEntry.value);
                //console.log('new entry ' + obj.id, obj.value);
                if (isequal(obj.value, oldEntry.value)) {
                    debug.debug(`Not saving ${aggregateDB}:${commonId} because has not changed`);
                } else {
                    obj.seqid = yield seqId.getNextSequenceID('aggregation_' + aggregateDB);
                    yield aggregation.save(aggregateDB, obj);
                }

            }
            yield seqIdTrack.setSeqIds(aggregateDB, maxSeqIds);
        } while (commonIdsSet.size);
    })();
};

function aggregate(data, filter) {
    var result = {};
    var accept = true;
    for (var key in filter) {
        if (data[key]) {
            accept = filter[key].call(
                null,
                data[key].map(d => d.data),
                result,
                data[key].length ? data[key][0].commonID : null,
                data[key].map(d => d._id));

            if (accept === false) {
                break;
            }
        }
    }
    if (accept === false) {
        return null;
    }
    return result;
}