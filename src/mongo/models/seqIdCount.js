'use strict';

const model = require('./../model');

const Model = model.getSeqIdCount();

exports.getNextSequenceID = async function (name) {
  const result = await Model.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).exec();
  return result.seq;
};

exports.clear = function () {
  return Model.remove({});
};
