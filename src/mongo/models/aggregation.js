'use strict';

const debug = require('../../util/debug')('model:aggregation');

const model = require('./../model');

exports.save = function (name, data) {
  debug.trace(`save to ${name}: ${data.id}`);
  const id = data._id;
  delete data._id;
  const Model = model.getAggregation(name);
  return Model.findByIdAndUpdate(id, data, { new: true, upsert: true }).exec();
};

exports.findAll = function (name) {
  const Model = model.getAggregation(name);
  return Model.find({});
};

exports.getLatestSeqId = function (name) {
  debug(`get latest seq id from ${name}`);
  const Model = model.getAggregation(name);
  return Model.findOne({})
    .sort({ seqid: 'desc' })
    .exec();
};

exports.findById = function (name, id) {
  const Model = model.getAggregation(name);
  // Don't return deleted entries
  return Model.findById(id)
    .where({ action: { $ne: 'delete' } })
    .exec();
};

exports.countFromSeqId = function (name, fromSeqId) {
  const Model = model.getAggregation(name);
  return Model.count({ seqid: { $gt: fromSeqId } });
};

exports.count = function (name) {
  const Model = model.getAggregation(name);
  return Model.count();
};
