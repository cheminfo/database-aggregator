import { globalConfig } from '../config/config';
import { IAggregationConfigElement, ISourceConfigElement } from '../types';
import { getLastStatus } from '../mongo/models/schedulerLog';
import { getAggregationTaskId, getCopyTaskId } from '../util/names';

interface IAggregationTask {
  collection: string;
  enabled: boolean;
  sources: string[];
  status?: string | null;
}

interface ISourceTask {
  collection: string;
  enabled: boolean;
  copyCronRule?: string;
  copyMissingIdsCronRule?: string;
  removeCronRule?: string;
  status?: string | null;
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

export async function getTasks() {
  const taskSources = sources.slice();
  const taskAgg = aggregations.slice();
  const statuses = await Promise.all([
    Promise.all(
      taskSources.map((source) =>
        getLastStatus(getCopyTaskId(source.collection))
      )
    ),
    Promise.all(
      taskAgg.map((agg) => getLastStatus(getAggregationTaskId(agg.collection)))
    )
  ]);

  taskSources.forEach((s, idx) => (s.status = statuses[0][idx]));
  taskAgg.forEach((agg, idx) => (agg.status = statuses[1][idx]));

  return {
    sources: taskSources,
    aggregations: taskAgg
  };
}

export async function getAggregation(name: string) {
  const foundAggregation = aggregations.find(
    (aggregation) => aggregation.collection === name
  );
  if (foundAggregation) {
    const status = await getLastStatus(
      getCopyTaskId(foundAggregation.collection)
    );
    foundAggregation.status = status;
  }
  return foundAggregation;
}

export async function getSource(name: string) {
  const foundSource = sources.find((source) => source.collection === name);
  if (foundSource) {
    const status = await getLastStatus(getCopyTaskId(foundSource.collection));
    foundSource.status = status;
  }
  return foundSource;
}
