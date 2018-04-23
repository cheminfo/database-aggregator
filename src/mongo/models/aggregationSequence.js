'use strict';

const model = require('./../model');

const Model = model.getAggregationSequence();

exports.getLastSeqIds = async function (name) {
  const result = await Model.findById(name).exec();
  if (result) return result.sourceSeq;
  return null;
};

exports.setSeqIds = async function (name, seqIds) {
  const result = await Model.findByIdAndUpdate(
    name,
    { sourceSeq: seqIds },
    { new: true, upsert: true }
  ).exec();
  return result.sourceSeq;
};

exports.clear = function () {
  return Model.remove({});
};
