'use strict';

import { getSourceSequence } from '../model';
const Model = getSourceSequence();
export async function getNextSequenceID(name: string) {
  const result = await Model.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).exec();
  return result.seq;
}

export async function getSourceVersion(name: string) {
  const result = await Model.findById(name, { version: 1 }).exec();
  if (!result) return 0;
  return result.version;
}

export function updateSourceVersion(name: string, newVersion: number) {
  return Model.findByIdAndUpdate(name, { version: newVersion }).exec();
}

export function clear() {
  return Model.remove({});
}
