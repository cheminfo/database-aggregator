'use strict';

const debug = require('../../util/debug')('model:aggregation');

const model = require('./../model');

exports.save = function (name, data) {
  debug.trace(`save to ${name}: ${data.id}`);
  const Model = model.getAggregation(name);
  return Model.update({ id: data.id }, data, {
    new: true,
    upsert: true
  }).exec();
};

exports.findAll = function (name) {
  const Model = model.getAggregation(name);
  return Model.find({});
};

exports.findById = function (name, id) {
  const Model = model.getAggregation(name);
  // Don't return deleted entries
  return Model.findOne({ id }).exec();
};

exports.deleteById = function (name, id) {
  const Model = model.getAggregation(name);
  return Model.deleteOne({ id });
};

exports.count = function (name) {
  const Model = model.getAggregation(name);
  return Model.count();
};
