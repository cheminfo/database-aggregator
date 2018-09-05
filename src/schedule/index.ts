import { globalConfig } from '../config/config';
import { IAggregationConfigElement, ISourceConfigElement } from '../types';

interface ITask {
  type: TaskType;
  collection: string;
}

enum TaskType {
  aggregation = 'aggregation',
  source = 'source'
}

const aggregationConfigs = globalConfig.aggregation;
const sourceConfigs = globalConfig.source;

const aggregations: ITask[] = [];
const sources: ITask[] = [];

for (const aggregation of Object.keys(aggregationConfigs)) {
  aggregations.push(makeAggregationTask(aggregationConfigs[aggregation]));
}

for (const source of Object.keys(sourceConfigs)) {
  sources.push(makeSourceTask(sourceConfigs[source]));
}

function makeAggregationTask(aggregation: IAggregationConfigElement): ITask {
  return {
    type: TaskType.aggregation,
    collection: aggregation.collection
  };
}

function makeSourceTask(source: ISourceConfigElement): ITask {
  return {
    type: TaskType.source,
    collection: source.collection
  };
}

export function getTasks() {
  return {
    aggregations,
    sources
  };
}
