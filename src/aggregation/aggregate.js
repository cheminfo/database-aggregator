'use strict';

const isequal = require('lodash.isequal');

const aggregationSequence = require('./../mongo/models/aggregationSequence');
const config = require('./../config/config').globalConfig;
const aggregation = require('./../mongo/models/aggregation');
const source = require('./../mongo/models/source');
const debug = require('./../util/debug')('aggregation');

const defaultChunkSize = 1000;

module.exports = function (aggregateDB) {
  debug.trace('get common ids');
  var conf = config.aggregation[aggregateDB];
  if (!conf) {
    return Promise.reject(
      new Error(`No aggregation configuration for ${aggregateDB}`)
    );
  }

  var sourceNames = Object.keys(conf.sources);
  var maxSeqIds = {};
  var commonIdsSet;
  var chunkSize = conf.chunkSize || defaultChunkSize;

  return (async function () {
    do {
      let seqIds = await aggregationSequence.getLastSeqIds(aggregateDB);
      seqIds = seqIds || {};
      let commonIds = [];

      for (let i = 0; i < sourceNames.length; i++) {
        let sourceName = sourceNames[i];
        let firstSeqId = seqIds[sourceName] || 0;
        let lastSeqId = firstSeqId + chunkSize;
        let lastSourceSeq = await source.getLastSeqId(sourceName);
        maxSeqIds[sourceName] = Math.min(
          lastSeqId,
          lastSourceSeq ? lastSourceSeq.sequentialID : 0
        );
        let cids = await source.getCommonIds(sourceName, firstSeqId, lastSeqId);
        cids = cids.map((commonId) => commonId.commonID);
        commonIds = commonIds.concat(cids);
      }

      commonIdsSet = new Set(commonIds);

      for (let commonId of commonIdsSet) {
        let data = {};
        for (let i = 0; i < sourceNames.length; i++) {
          let sourceName = sourceNames[i];
          data[sourceName] = await source.getByCommonId(sourceName, commonId);
        }
        var exists = checkExists(data);
        let obj = {};
        obj._id = commonId;
        obj.date = Date.now();
        if (!exists) {
          obj.value = null;
        } else {
          // aggregate will return null if config scripts decided
          // it should not be saved
          obj.value = await aggregate(data, conf.sources, commonId);
        }

        let oldEntry = await aggregation.findById(aggregateDB, commonId);
        if (obj.value === null) {
          if (oldEntry) {
            await aggregation.deleteById(aggregateDB, commonId);
          } else {
            // Nothing to do, the data was deleted from sources and does not
            // exist or was deleted in aggregation
            debug.trace(
              `Ignoring ${aggregateDB}:${commonId}, which ought to be deleted but does not exist or was already deleted`
            );
          }
        } else {
          oldEntry = oldEntry || {};
          if (isequal(obj.value, oldEntry.value)) {
            // Don't save if has not changed
            debug.trace(
              `Not saving ${aggregateDB}:${commonId} because has not changed`
            );
          } else {
            // Save document
            debug.trace(`Saving ${aggregateDB}:${commonId}`);
            await aggregation.save(aggregateDB, obj);
          }
        }
      }
      await aggregationSequence.setSeqIds(aggregateDB, maxSeqIds);
    } while (commonIdsSet.size > 0);
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

async function aggregate(data, filter, commonId) {
  var result = {};
  var accept = true;
  for (var key in filter) {
    if (data[key]) {
      accept = await Promise.resolve(
        filter[key].call(
          null,
          data[key].map((d) => d.data),
          result,
          commonId,
          data[key].map((d) => d._id)
        )
      );

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
