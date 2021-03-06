import { IObject } from '../../internalTypes';
import { getAggregationSequence } from '../model';
const Model = getAggregationSequence();

export async function getLastSeqIds(name: string) {
  const result = await Model.findById(name).exec();
  if (result) {
    return result.sourceSeq;
  }
  return {};
}

export async function setSeqIds(name: string, seqIds: IObject<number>) {
  const result = await Model.findByIdAndUpdate(
    name,
    { sourceSeq: seqIds },
    { new: true, upsert: true }
  ).exec();
  return result.sourceSeq;
}
