import * as mongoose from 'mongoose';

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
import {
  ISchedulerLogDocument,
  ISourceDocument,
  IAggregationDocument,
  ISourceSequenceDocument,
  IAggregationSequenceDocument
} from '../internalTypes';

const models = new Map<string, mongoose.Model<mongoose.Document>>();

export function getSource(name: string) {
  return getModel<ISourceDocument>(getSourceModelName(name), sourceSchema);
}

export function getSourceIfExists(name: string) {
  return getModelIfExists<ISourceDocument>(
    getSourceModelName(name),
    sourceSchema
  );
}

export async function dropSource(name: string) {
  const collName = getSourceName(name);
  await dropCollection(collName);
}

export function getAggregation(name: string) {
  return getModel<IAggregationDocument>(
    getAggregationModelName(name),
    aggregationSchema
  );
}

export function dropAggregation(name: string) {
  const collName = getAggregationModelName(name);
  const aggregationSequence = getAggregationSequence();
  return Promise.all([
    dropCollection(collName),
    aggregationSequence.deleteOne({ _id: name })
  ]);
}

export function getAggregationIfExists(name: string) {
  return getModelIfExists<IAggregationDocument>(
    getAggregationModelName(name),
    aggregationSchema
  );
}

export function getSourceSequence() {
  return getModel<ISourceSequenceDocument>(
    getMetaModelName('source_sequence'),
    sourceSequenceSchema
  );
}

export function getAggregationSequence() {
  return getModel<IAggregationSequenceDocument>(
    getMetaModelName('aggregation_sequence'),
    aggregationSequenceSchema
  );
}

export function getSchedulerLog() {
  return getModel<ISchedulerLogDocument>(
    getMetaModelName('scheduler_log'),
    schedulerLogSchema
  );
}

function getModel<T extends mongoose.Document = mongoose.Document>(
  collName: string,
  schema: Schema
): mongoose.Model<T> {
  let model = models.get(collName) as mongoose.Model<T>;
  if (model) {
    return model;
  }
  model = mongoose.model(collName, schema, collName);
  models.set(collName, model);
  return model;
}

async function getModelIfExists<
  T extends mongoose.Document = mongoose.Document
>(collName: string, schema: Schema): Promise<mongoose.Model<T> | null> {
  let model = models.get(collName) as mongoose.Model<T>;
  if (model) {
    return model;
  }

  const hasCol = await hasCollection(collName);
  if (!hasCol) {
    return null;
  }
  model = mongoose.model(collName, schema, collName);
  models.set(collName, model);
  return model;
}
