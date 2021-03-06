import { globalConfig } from '../config/config';
import {
  IAggregationConfigElement,
  ISchedulerStatus,
  ISourceConfigElement
} from '../internalTypes';
import { getLastState } from '../mongo/models/schedulerLog';
import {
  getAggregationTaskId,
  getCopyMissingIdTaskId,
  getCopyTaskId,
  getRemoveTaskId
} from '../util/names';

interface IAggregationTask {
  collection: string;
  enabled: boolean;
  sources: string[];
  state?: ISchedulerStatus | null;
}

interface ISourceTask {
  collection: string;
  enabled: boolean;
  copyCronRule?: string;
  copyMissingIdsCronRule?: string;
  removeCronRule?: string;
  state?: ISchedulerStatus | null;
  copyState?: ISchedulerStatus | null;
  removeState?: ISchedulerStatus | null;
  copyMissingIdsState?: ISchedulerStatus | null;
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
  const taskSources = sources.map(shallowCopy);
  const taskAgg = aggregations.map(shallowCopy);
  const statuses = await Promise.all([
    Promise.all(
      taskSources.map((source) =>
        Promise.all([
          getLastState(getCopyTaskId(source.collection)),
          getLastState(getRemoveTaskId(source.collection)),
          getLastState(getCopyMissingIdTaskId(source.collection))
        ])
      )
    ),
    Promise.all(
      taskAgg.map((agg) => getLastState(getAggregationTaskId(agg.collection)))
    )
  ]);

  taskSources.forEach((s, idx) => {
    s.copyState = statuses[0][idx][0];
    s.removeState = statuses[0][idx][1];
    s.copyMissingIdsState = statuses[0][idx][2];
  });
  taskAgg.forEach((agg, idx) => (agg.state = statuses[1][idx]));

  return {
    sources: taskSources,
    aggregations: taskAgg
  };
}

export async function getAggregation(name: string) {
  let foundAggregation = aggregations.find(
    (aggregation) => aggregation.collection === name
  );
  if (foundAggregation) {
    foundAggregation = shallowCopy(foundAggregation);
    const state = await getLastState(
      getCopyTaskId(foundAggregation.collection)
    );
    foundAggregation.state = state;
  }
  return foundAggregation;
}

export async function getSource(name: string) {
  let foundSource = sources.find((source) => source.collection === name);
  if (foundSource === undefined) {
    throw new Error('source not found');
  }

  if (foundSource) {
    foundSource = shallowCopy(foundSource);
    const state = await Promise.all([
      getLastState(getCopyTaskId(foundSource.collection)),
      getLastState(getRemoveTaskId(foundSource.collection)),
      getLastState(getCopyMissingIdTaskId(foundSource.collection))
    ]);
    foundSource.copyState = state[0];
    foundSource.removeState = state[1];
    foundSource.copyMissingIdsState = state[2];
  }
  return foundSource;
}

function shallowCopy<T>(object: T): T {
  return Object.assign({}, object);
}
