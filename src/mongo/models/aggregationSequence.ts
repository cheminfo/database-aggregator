import { getAggregationSequence } from "../model";
const Model = getAggregationSequence();

export async function getLastSeqIds(name: string) {
  const result = await Model.findById(name).exec();
  if (result) { return result.sourceSeq; }
  return null;
}

export async function setSeqIds(name: string, seqIds: string) {
  const result = await Model.findByIdAndUpdate(
    name,
    { sourceSeq: seqIds },
    { new: true, upsert: true },
  ).exec();
  return result.sourceSeq;
}
