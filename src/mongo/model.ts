const mongoose = require('mongoose');

import aggregationSchema from '../schema/aggregation';
import aggregationSequenceSchema from '../schema/aggregationSequence';
import schedulerLogSchema from '../schema/schedulerLog';
import sourceSchema from '../schema/source';
import sourceSequenceSchema from '../schema/sourceSequence';

import { Schema } from 'mongoose';
import { dropCollection, hasCollection } from '../mongo/connection';
import {
  getSourceModelName,
  getSourceName,
  getAggregationModelName,
  getMetaModelName
} from '../util/names';

const models = new Map();

export function getSource(name: string) {
  return getModel(getSourceModelName(name), sourceSchema);
}

export async function dropSource(name: string) {
  const collName = getSourceName(name);
  await dropCollection(collName);
}

export function getAggregation(name: string) {
  return getModel(getAggregationModelName(name), aggregationSchema);
}

export async function dropAggregation(name: string) {
  const collName = getAggregationModelName(name);
  await dropCollection(collName);
}

export function getAggregationIfExists(name: string) {
  return getModelIfExists(getAggregationModelName(name), aggregationSchema);
}

export function getSourceSequence() {
  return getModel(getMetaModelName('source_sequence'), sourceSequenceSchema);
}

export function getAggregationSequence() {
  return getModel(
    getMetaModelName('aggregation_sequence'),
    aggregationSequenceSchema
  );
}

export function getSchedulerLog() {
  return getModel(getMetaModelName('scheduler_log'), schedulerLogSchema);
}

function getModel(collName: string, schema: Schema) {
  if (models.has(collName)) {
    return models.get(collName);
  }
  const model = mongoose.model(collName, schema, collName);
  models.set(collName, model);
  return model;
}

async function getModelIfExists(collName: string, schema: Schema) {
  if (models.has(collName)) {
    return models.get(collName);
  } else {
    const hasCol = await hasCollection(collName);
    if (!hasCol) {
      return null;
    }
    const model = mongoose.model(collName, schema, collName);
    models.set(collName, model);
    return model;
  }
}
