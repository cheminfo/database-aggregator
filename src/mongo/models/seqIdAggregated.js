'use strict';

const model = require('./../model');

const Model = model.getSeqIdAggregated();

exports.getLastSeqIds = function (name) {
  return Model.findById(name).exec().then((result) => {
    if (result) return result.seq;
    return null;
  });
};

exports.setSeqIds = function (name, seqIds) {
  return Model.findByIdAndUpdate(name, { seq: seqIds }, { new: true, upsert: true })
    .exec()
    .then((result) => result.seq);
};

exports.clear = function () {
  return Model.remove({});
};
