'use strict';

const mongoose = require('mongoose');

const sourceSchema = require('../schema/source');
const aggregationSchema = require('../schema/aggregation');
const sourceSequenceSchema = require('../schema/sourceSequence');
const aggregationSequenceSchema = require('../schema/aggregationSequence');
const schedulerLogSchema = require('../schema/schedulerLog');
const { hasCollection, dropCollection } = require('../mongo/connection');

const models = new Map();

const AGGREGATION = 'aggregation';
const SOURCE = 'source';
const META = 'meta';

exports.getSource = function (name) {
  return getModel(SOURCE, name, sourceSchema);
};

exports.dropSource = async function (name) {
  const collName = exports.getSourceName(name);
  await dropCollection(collName);
};

exports.getSourceName = function (name) {
  return getModelName(SOURCE, name);
};

exports.getAggregationName = function (name) {
  return getModelName(AGGREGATION, name);
};

exports.getAggregation = function (name) {
  return getModel(AGGREGATION, name, aggregationSchema);
};

exports.dropAggregation = async function (name) {
  const collName = exports.getAggregationName(name);
  await dropCollection(collName);
};

exports.getAggregationIfExists = function (name) {
  return getModelIfExists(AGGREGATION, name, aggregationSchema);
};

exports.getSourceSequence = function () {
  return getModel(META, 'source_sequence', sourceSequenceSchema);
};

exports.getAggregationSequence = function () {
  return getModel(META, 'aggregation_sequence', aggregationSequenceSchema);
};

exports.getSchedulerLog = function () {
  return getModel(META, 'scheduler_log', schedulerLogSchema);
};

function getModel(prefix, name, schema) {
  const collName = getModelName(prefix, name);
  if (models.has(collName)) {
    return models.get(collName);
  }
  const model = mongoose.model(collName, schema, collName);
  models.set(collName, model);
  return model;
}

function getModelName(prefix, name) {
  return `${prefix}_${name}`;
}

async function getModelIfExists(prefix, name, schema) {
  const collName = getModelName(prefix, name);
  if (models.has(collName)) {
    return models.get(collName);
  } else {
    const hasCol = await hasCollection(collName);
    if (!hasCol) return null;
    const model = mongoose.model(collName, schema, collName);
    models.set(collName, model);
    return model;
  }
}
