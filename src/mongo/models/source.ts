import { debugUtil } from '../../util/debug';
import { getSource } from '../model';

const debug = debugUtil('model:source');

export function getCommonIds(
  name: string,
  fromSeq: number,
  chunkSize?: number
) {
  debug.trace(`getCommonIds for source ${name} from seq ${fromSeq}`);
  fromSeq = fromSeq || 0;
  const Model = getSource(name);
  const query = {
    sequentialID: {
      $gt: fromSeq
    }
  };

  const find = Model.find(query).select({ commonID: 1, sequentialID: 1 });
  if (chunkSize !== undefined) {
    find.limit(chunkSize);
  }
  find.sort({ sequentialID: 1 });
  return find.exec();
}

export function getLastSeqId(name: string) {
  const Model = getSource(name);
  return Model.findOne({}).sort({ sequentialID: 'desc' });
}

export function getByCommonId(name: string, commonId: string) {
  debug.trace(`get source ${name}, commonID: ${commonId}`);
  const Model = getSource(name);
  // Don't include deleted data
  return Model.find({ commonID: commonId, data: { $ne: null } }).exec();
}
