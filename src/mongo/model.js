'use strict';

const mongoose = require('mongoose');

const sourceSchema = require('../schema/source');
const aggregationSchema = require('../schema/aggregation');
const sourceSequenceSchema = require('../schema/sourceSequence');
const seqIdAggregatedSchema = require('../schema/seqIdAggregated');
const schedulerLogSchema = require('../schema/schedulerLog');
const connection = require('../mongo/connection');

const models = new Map();

exports.getSource = function (name) {
  return getModel('source', name, sourceSchema);
};

exports.getAggregation = function (name) {
  return getModel('aggregation', name, aggregationSchema);
};

exports.getAggregationIfExists = function (name) {
  return getModelIfExists('aggregation', name, aggregationSchema);
};

exports.getSourceSequence = function () {
  return getModel('meta', 'source_sequence', sourceSequenceSchema);
};

exports.getSeqIdAggregated = function () {
  return getModel('meta', 'seqIdAggregated', seqIdAggregatedSchema);
};

exports.getSchedulerLog = function () {
  return getModel('meta', 'schedulerLog', schedulerLogSchema);
};

function getModel(prefix, name, schema) {
  const collName = `${prefix}_${name}`;
  if (models.has(collName)) {
    return models.get(collName);
  }
  const model = mongoose.model(collName, schema, collName);
  models.set(collName, model);
  return model;
}

async function getModelIfExists(prefix, name, schema) {
  const collName = `${prefix}_${name}`;
  if (models.has(collName)) {
    return models.get(collName);
  } else {
    const hasCol = await connection.hasCollection(collName);
    if (!hasCol) return null;
    const model = mongoose.model(collName, schema, collName);
    models.set(collName, model);
    return model;
  }
}
