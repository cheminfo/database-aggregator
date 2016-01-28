'use strict';

const seqIdTrack = require('./mongo/models/seqIdAggregated');
const config = require('./config/config').globalConfig;
const aggregation = require('./mongo/models/aggregation');
const source = require('./mongo/models/source');
const debug = require('./util/debug')('aggregation');
const seqId = require('./mongo/models/seqIdCount');

module.exports = {
    update: function (aggregateDB) {
        debug.trace('get common ids');
        var conf = config.aggregation[aggregateDB];
        if (!conf) return Promise.reject(new Error(`No aggregation configuration for ${aggregateDB}`));


        var sourceNames = Object.keys(conf.sources);
        var maxSeqIds = {};

        return seqIdTrack.getLastSeqIds(aggregateDB)
            .then(seqIds => {
                seqIds = seqIds || {};
                // Get commonID of entries that have seqid > seqId
                return Promise.all(sourceNames.map(sourceName => {
                    return source.getCommonIds(sourceName, seqIds[sourceName] || 0)
                        .then(commonIds => {
                            maxSeqIds[sourceName] = commonIds[commonIds.length-1].sequentialID;
                            return commonIds.map(commonId => commonId.commonID);
                        });
                }));
            })
            .then(setFromCommonIds)
            .then(commonIds => {
                commonIds = Array.from(commonIds);
                var prom = Promise.resolve();
                for (let i = 0; i < commonIds.length; i++) {
                    let commonId = commonIds[i];
                    prom = prom.then(() => {
                        return Promise.all(sourceNames.map(sourceName => {
                            return source.getByCommonId(sourceName, commonId);
                        })).then(data => {
                            var obj = {};
                            for (let j = 0; j < data.length; j++) {
                                obj[sourceNames[j]] = data[j].map(d => d.data);
                            }
                            return obj;
                        }).then(data => {
                            let obj = {};
                            obj.id = commonId;
                            obj.action = 'update';
                            obj.date = Date.now();
                            obj.value = aggregate(data, conf.sources);
                            if(obj.value === null) return;
                            return seqId.getNextSequenceID(aggregateDB).then(seqid => {
                                obj.seqid = seqid;
                                return aggregation.save(aggregateDB, obj);
                            });
                        });
                    });
                }
                return prom;
            }).then(() => {
                return seqIdTrack.setSeqIds(aggregateDB, maxSeqIds);
            })
    }
};

function setFromCommonIds(commonIds) {
    var s = new Set();
    for (let i = 0; i < commonIds.length; i++) {
        for (let j = 0; j < commonIds[i].length; j++) {
            s.add(commonIds[i][j]);
        }
    }
    return s;
}

function aggregate(data, filter) {
    var result = {};
    var accept = true;
    for (var key in filter) {
        if (data[key]) {
            accept = filter[key].call(null, data[key], result);
            if(accept === false) {
                break;
            }
        }
    }
    if(!accept) {
        return null;
    }
    return result;
}