import {
  ISourceBase,
  IObject,
  ISourceEntry,
  IAggregationEntry,
  IAggregationCallback,
  IAggregationConfigElement
} from '../types';
import { setSeqIds, getLastSeqIds } from '../mongo/models/aggregationSequence';
import { aggregation as aggregationValidation } from '../config/validation';
import {
  getCommonIds,
  getByCommonId,
  getLastSeqId
} from '../mongo/models/source';
import { deleteById, save } from '../mongo/models/aggregation';
import { debugUtil } from '../util/debug';
const isequal = require('lodash.isequal');
const debug = debugUtil('aggregation');

export async function aggregate(conf: IAggregationConfigElement) {
  conf = aggregationValidation(conf);
  const { collection, sources, chunkSize } = conf;
  const sourceNames = Object.keys(sources);
  const maxSeqIds: IObject<number> = {};
  var commonIdsSet;

  debug.trace('get common ids');
  do {
    // while commonIdsSet.size > 0
    let seqIds = await getLastSeqIds(collection);
    seqIds = seqIds || {};
    let commonIds: string[] = [];

    // Iterate over dependees
    for (let i = 0; i < sourceNames.length; i++) {
      let sourceName = sourceNames[i];
      let firstSeqId = seqIds[sourceName] || 0;
      let lastSeqId = firstSeqId + chunkSize;
      let lastSourceSeq = await getLastSeqId(sourceName);
      maxSeqIds[sourceName] = Math.min(
        lastSeqId,
        lastSourceSeq ? lastSourceSeq.sequentialID : 0
      );
      const cidBases: ISourceBase[] = await getCommonIds(
        sourceName,
        firstSeqId,
        lastSeqId
      );
      const cids = cidBases.map(commonId => commonId.commonID);
      commonIds = commonIds.concat(cids);
    }

    commonIdsSet = new Set(commonIds);

    for (let commonId of commonIdsSet) {
      let data: IObject<ISourceEntry[]> = {};
      for (let i = 0; i < sourceNames.length; i++) {
        let sourceName = sourceNames[i];
        data[sourceName] = await getByCommonId(sourceName, commonId);
      }
      var exists = checkExists(data);
      let obj: IAggregationEntry = {
        id: commonId,
        date: Date.now(),
        value: null
      };

      if (exists) {
        // aggregateValue will return null if config scripts decided
        // it should not be saved
        obj.value = await aggregateValue(data, sources, commonId);
      }

      let oldEntry = await findById(collection, commonId);
      if (obj.value === null) {
        if (oldEntry) {
          await deleteById(collection, commonId);
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
          await save(collection, obj);
        }
      }
    }
    await setSeqIds(collection, maxSeqIds);
  } while (commonIdsSet.size > 0);
}

function checkExists(data: IObject<any>) {
  for (let source in data) {
    if (data[source].length !== 0) {
      return true;
    }
  }
  return false;
}

async function aggregateValue(
  data: IObject<ISourceEntry[]>,
  filter: IObject<IAggregationCallback>,
  commonId: string
) {
  var result = {};
  var accept = true;
  for (var key in filter) {
    if (data[key]) {
      accept = await Promise.resolve(
        filter[key].call(
          null,
          data[key].map(d => d.data),
          result,
          commonId,
          data[key].map(d => d.id)
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
