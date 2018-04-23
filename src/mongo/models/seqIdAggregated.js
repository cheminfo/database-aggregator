'use strict';

const model = require('./../model');

const Model = model.getSeqIdAggregated();

exports.getLastSeqIds = async function (name) {
  const result = await Model.findById(name).exec();
  if (result) return result.seq;
  return null;
};

exports.setSeqIds = async function (name, seqIds) {
  const result = await Model.findByIdAndUpdate(
    name,
    { seq: seqIds },
    { new: true, upsert: true }
  ).exec();
  return result.seq;
};

exports.clear = function () {
  return Model.remove({});
};
