import { globalConfig } from '../config/config';
import { IAggregationConfigElement, ISourceConfigElement } from '../types';

interface IAggregationTask {
  collection: string;
  enabled: boolean;
  sources: string[];
}

interface ISourceTask {
  collection: string;
  enabled: boolean;
  copyCronRule?: string;
  copyMissingIdsCronRule?: string;
  removeCronRule?: string;
}

const aggregationConfigs = globalConfig.aggregation;
const sourceConfigs = globalConfig.source;

const aggregations: IAggregationTask[] = [];
const sources: ISourceTask[] = [];

for (const aggregation of Object.keys(aggregationConfigs)) {
  aggregations.push(makeAggregationTask(aggregationConfigs[aggregation]));
}

for (const source of Object.keys(sourceConfigs)) {
  sources.push(makeSourceTask(sourceConfigs[source]));
}

function makeAggregationTask(
  aggregation: IAggregationConfigElement
): IAggregationTask {
  return {
    collection: aggregation.collection,
    enabled: !aggregation.disabled,
    sources: Object.keys(aggregation.sources)
  };
}

function makeSourceTask(source: ISourceConfigElement): ISourceTask {
  return {
    collection: source.collection,
    enabled: !source.disabled,
    copyCronRule: source.copyCronRule,
    copyMissingIdsCronRule: source.copyMissingIdsCronRule,
    removeCronRule: source.removeCronRule
  };
}

export function getTasks() {
  return {
    aggregations,
    sources
  };
}

export function getAggregation(name: string) {
  return aggregations.find((aggregation) => aggregation.collection === name);
}

export function getSource(name: string) {
  return sources.find((source) => source.collection === name);
}
