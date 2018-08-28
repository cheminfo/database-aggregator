import { IAggregationEntry } from '../../types';

'use strict';

const debug = require('../../util/debug')('model:aggregation');

import { getAggregation } from '../model';

exports.save = function(name: string, data: IAggregationEntry) {
  debug.trace(`save to ${name}: ${data.id}`);
  const Model = getAggregation(name);
  return Model.update({ id: data.id }, data, {
    new: true,
    upsert: true
  }).exec();
};

exports.findAll = function(name: string) {
  const Model = getAggregation(name);
  return Model.find({});
};

exports.findById = function(name: string, id: string) {
  const Model = getAggregation(name);
  // Don't return deleted entries
  return Model.findOne({ id }).exec();
};

exports.deleteById = function(name: string, id: string) {
  const Model = getAggregation(name);
  return Model.deleteOne({ id });
};

exports.count = function(name: string) {
  const Model = getAggregation(name);
  return Model.count();
};
