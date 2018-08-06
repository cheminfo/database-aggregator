'use strict';

const model = require('../model');

const Model = model.getSourceSequence();

exports.getNextSequenceID = async function (name) {
  const result = await Model.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).exec();
  return result.seq;
};

exports.getSourceVersion = async function (name) {
  const result = await Model.findById(name, { version: 1 }).exec();
  return result.version;
};

exports.updateSourceVersion = function (name, newVersion) {
  return Model.findByIdAndUpdate(name, { version: newVersion }).exec();
};

exports.clear = function () {
  return Model.remove({});
};
