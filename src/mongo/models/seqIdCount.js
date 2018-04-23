'use strict';

const model = require('./../model');

const Model = model.getSeqIdCount();

exports.getNextSequenceID = function (name) {
  return Model.findByIdAndUpdate(name, { $inc: { seq: 1 } }, { new: true, upsert: true })
    .exec()
    .then((result) => result.seq);
};

exports.clear = function () {
  return Model.remove({});
};
