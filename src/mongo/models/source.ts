'use strict';

import { getSource } from '../model';
import { debugUtil } from '../../util/debug';

const debug = debugUtil('model:source');

export function getCommonIds(name: string, fromSeq: number, toSeq: number) {
  debug.trace(`getCommonIds for source ${name} from seq ${fromSeq}`);
  fromSeq = fromSeq || 0;
  var Model = getSource(name);
  return Model.find({
    sequentialID: {
      $gt: fromSeq,
      $lte: toSeq
    }
  })
    .select({ commonID: 1, sequentialID: 1 })
    .exec();
}

export function getLastSeqId(name: string) {
  const Model = getSource(name);
  return Model.findOne({}).sort({ sequentialID: 'desc' });
}

export function getByCommonId(name: string, commonId: string) {
  debug.trace(`get source ${name}, commonID: ${commonId}`);
  var Model = getSource(name);
  // Don't include deleted data
  return Model.find({ commonID: commonId, data: { $ne: null } }).exec();
}
