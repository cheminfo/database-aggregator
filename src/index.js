'use strict';

const seqIdTrack = require('./mongo/seqidTrack');
const config = require('./config/config').globalConfig;
const aggregation = require('./mongo/aggregation');
const source = require('./mongo/source');
const debug = require('./util/debug')('aggregation');
const seqId = require('./mongo/seqid');

module.exports = {
    update: function(aggregateDB) {
        debug.trace('get common ids');
        var conf = config.aggregation[aggregateDB];
        if(!conf) return Promise.reject(new Error(`No aggregation configuration for ${aggregateDB}`));


        var sourceNames = Object.keys(conf.sources);
        var maxSeqId = 0;

        return seqIdTrack.getLastSeqId(aggregateDB)
            .then(seqId => {
                console.log('last seq id', seqId);
                // Get commonID of entries that have seqid > seqId
                return Promise.all(sourceNames.map(sourceName => {
                    console.log(sourceName, seqId)
                    return source.getCommonIds(sourceName, seqId);
                }));
            })
            .then(setFromCommonIds)
            .then(commonIds => {
                commonIds = Array.from(commonIds);
                var prom = Promise.resolve();
                for(let i=0; i<commonIds.length; i++) {
                    let commonId = commonIds[i];
                    prom = prom.then(() => {
                        return Promise.all(sourceNames.map(sourceName => {
                            return source.getByCommonId(sourceName, commonId);
                        })).then(data => {
                            var obj = {};
                            for(let j=0; j<data.length; j++) {
                                maxSeqId = Math.max(maxSeqId, Math.max.apply(null, data[j].map(d => d.sequentialID)));
                                obj[sourceNames[j]] = data[j].map(d => d.data);
                            }
                            return obj;
                        }).then(data => {
                            let obj = {};
                            obj.id = commonId;
                            obj.action = 'update';
                            obj.date = Date.now();
                            obj.value = aggregate(data, conf.sources);
                            return seqId.getNextSequenceID(aggregateDB).then(seqid => {
                                obj.seqid = seqid;
                                return aggregation.save(aggregateDB, obj);
                            });
                        });
                    });
                }
                return prom;
            }).then(() => {
                if(!maxSeqId) return Promise.resolve();
                return seqIdTrack.setSeqId(aggregateDB, maxSeqId);
            });
    }
};

function setFromCommonIds(commonIds) {
    var s = new Set();
    for(let i=0; i<commonIds.length ;i++) {
        for(let j=0; j<commonIds[i].length; j++) {
            s.add(commonIds[i][j]);
        }
    }
    return s;
}

function aggregate(data, filter) {
    var result={};
    for (var key in filter) {
        if (data[key]) {
            filter[key].call(null, data[key], result);
        }
    }
    return result;
}