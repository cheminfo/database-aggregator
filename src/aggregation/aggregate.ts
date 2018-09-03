import { aggregation as aggregationValidation } from '../config/validation';
import { deleteById, findById, save } from '../mongo/models/aggregation';
import { getLastSeqIds, setSeqIds } from '../mongo/models/aggregationSequence';
import {
  getByCommonId,
  getCommonIds,
  getLastSeqId
} from '../mongo/models/source';
import {
  IAggregationCallback,
  IAggregationConfigElement,
  IAggregationEntry,
  IObject,
  ISourceBase,
  ISourceEntry
} from '../types';
import { debugUtil } from '../util/debug';
const isequal = require('lodash.isequal');
const debug = debugUtil('aggregation');

export async function aggregate(conf: IAggregationConfigElement) {
  conf = aggregationValidation(conf);
  const { collection, sources, chunkSize } = conf;
  const sourceNames = Object.keys(sources);
  const maxSeqIds: IObject<number> = {};
  let commonIdsSet;

  debug.trace('get common ids');
  do {
    // while commonIdsSet.size > 0
    let seqIds = await getLastSeqIds(collection);
    seqIds = seqIds || {};
    let commonIds: string[] = [];

    // Iterate over dependees
    for (const sourceName of sourceNames) {
      const firstSeqId = seqIds[sourceName] || 0;
      const lastSourceSeq = await getLastSeqId(sourceName);
      const ids: ISourceBase[] = await getCommonIds(
        sourceName,
        firstSeqId,
        chunkSize
      );
      const lastCid = ids[ids.length - 1];
      maxSeqIds[sourceName] = Math.min(
        lastCid ? lastCid.sequentialID : 0,
        lastSourceSeq ? lastSourceSeq.sequentialID : 0
      );
      const cids = ids.map(cid => cid.commonID);
      commonIds = commonIds.concat(cids);
    }

    commonIdsSet = new Set(commonIds);

    for (const commonId of commonIdsSet) {
      const data: IObject<ISourceEntry[]> = {};
      for (const sourceName of sourceNames) {
        data[sourceName] = await getByCommonId(sourceName, commonId);
      }
      const exists = checkExists(data);
      const obj: IAggregationEntry = {
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
  for (const source in data) {
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
  const result = {};
  let accept = true;
  for (const key in filter) {
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
