'use strict';

const model = require('../model');
import { getSourceSequence } from '../model';
const Model = getSourceSequence();
exports.getNextSequenceID = async function(name: string) {
  const result = await Model.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).exec();
  return result.seq;
};

exports.getSourceVersion = async function(name: string) {
  const result = await Model.findById(name, { version: 1 }).exec();
  if (!result) return 0;
  return result.version;
};

exports.updateSourceVersion = function(name: string, newVersion: number) {
  return Model.findByIdAndUpdate(name, { version: newVersion }).exec();
};

exports.clear = function() {
  return Model.remove({});
};
