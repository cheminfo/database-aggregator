const mongoose = require("mongoose");

import aggregationSchema from "../schema/aggregation";
import aggregationSequenceSchema from "../schema/aggregationSequence";
import schedulerLogSchema from "../schema/schedulerLog";
import sourceSchema from "../schema/source";
import sourceSequenceSchema from "../schema/sourceSequence";

import { Schema } from "mongoose";
import { dropCollection, hasCollection } from "../mongo/connection";

const models = new Map();

const AGGREGATION = "aggregation";
const SOURCE = "source";
const META = "meta";

export function getSource(name: string) {
  return getModel(SOURCE, name, sourceSchema);
}

export async function dropSource(name: string) {
  const collName = exports.getSourceName(name);
  await dropCollection(collName);
}

export function getSourceName(name: string) {
  return getModelName(SOURCE, name);
}

export function getAggregationName(name: string) {
  return getModelName(AGGREGATION, name);
}

export function getAggregation(name: string) {
  return getModel(AGGREGATION, name, aggregationSchema);
}

export async function dropAggregation(name: string) {
  const collName = getAggregationName(name);
  await dropCollection(collName);
}

export function getAggregationIfExists(name: string) {
  return getModelIfExists(AGGREGATION, name, aggregationSchema);
}

export function getSourceSequence() {
  return getModel(META, "source_sequence", sourceSequenceSchema);
}

export function getAggregationSequence() {
  return getModel(META, "aggregation_sequence", aggregationSequenceSchema);
}

export function getSchedulerLog() {
  return getModel(META, "scheduler_log", schedulerLogSchema);
}

function getModel(prefix: string, name: string, schema: Schema) {
  const collName = getModelName(prefix, name);
  if (models.has(collName)) {
    return models.get(collName);
  }
  const model = mongoose.model(collName, schema, collName);
  models.set(collName, model);
  return model;
}

function getModelName(prefix: string, name: string) {
  return `${prefix}_${name}`;
}

async function getModelIfExists(prefix: string, name: string, schema: Schema) {
  const collName = getModelName(prefix, name);
  if (models.has(collName)) {
    return models.get(collName);
  } else {
    const hasCol = await hasCollection(collName);
    if (!hasCol) { return null; }
    const model = mongoose.model(collName, schema, collName);
    models.set(collName, model);
    return model;
  }
}
