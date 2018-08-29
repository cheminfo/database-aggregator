import { IAggregationEntry } from "../../types";
import { debugUtil } from "../../util/debug";
import { getAggregation } from "../model";

const debug = debugUtil("model:aggregation");
export function save(name: string, data: IAggregationEntry) {
  debug.trace(`save to ${name}: ${data.id}`);
  const Model = getAggregation(name);
  return Model.update({ id: data.id }, data, {
    new: true,
    upsert: true,
  }).exec();
}

export function findAll(name: string) {
  const Model = getAggregation(name);
  return Model.find({});
}

export function findById(name: string, id: string) {
  const Model = getAggregation(name);
  // Don't return deleted entries
  return Model.findOne({ id }).exec();
}

export function deleteById(name: string, id: string) {
  const Model = getAggregation(name);
  return Model.deleteOne({ id });
}

export function count(name: string) {
  const Model = getAggregation(name);
  return Model.count();
}
