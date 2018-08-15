'use strict';

const isequal = require('lodash.isequal');

const aggregation = require('../mongo/models/aggregation');
const source = require('../mongo/models/source');
const validation = require('../config/validation');
const debug = require('../util/debug')('aggregation');

const aggregationSequence = require('./../mongo/models/aggregationSequence');

async function aggregate(conf) {
  conf = validation.aggregation(conf);
  const { collection, sources, chunkSize } = conf;
  const sourceNames = Object.keys(sources);
  var maxSeqIds = {};
  var commonIdsSet;

  debug.trace('get common ids');
  do {
    // while commonIdsSet.size > 0
    let seqIds = await aggregationSequence.getLastSeqIds(collection);
    seqIds = seqIds || {};
    let commonIds = [];

    // Iterate over dependees
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
      obj.id = commonId;
      obj.date = Date.now();
      if (!exists) {
        obj.value = null;
      } else {
        // aggregateValue will return null if config scripts decided
        // it should not be saved
        obj.value = await aggregateValue(data, sources, commonId);
      }

      let oldEntry = await aggregation.findById(collection, commonId);
      if (obj.value === null) {
        if (oldEntry) {
          await aggregation.deleteById(collection, commonId);
        } else {
          // Nothing to do, the data was deleted from sources and does not
          // exist or was deleted in aggregation
          debug.trace(
            `Ignoring ${collection}:${commonId}, which ought to be deleted but does not exist or was already deleted`
          );
        }
      } else {
        oldEntry = oldEntry || {};
        if (isequal(obj.value, oldEntry.value)) {
          // Don't save if has not changed
          debug.trace(
            `Not saving ${collection}:${commonId} because has not changed`
          );
        } else {
          // Save document
          debug.trace(`Saving ${collection}:${commonId}`);
          await aggregation.save(collection, obj);
        }
      }
    }
    await aggregationSequence.setSeqIds(collection, maxSeqIds);
  } while (commonIdsSet.size > 0);
}

function checkExists(data) {
  for (let source in data) {
    if (data[source].length !== 0) {
      return true;
    }
  }
  return false;
}

async function aggregateValue(data, filter, commonId) {
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
          data[key].map((d) => d.id)
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

module.exports = aggregate;
