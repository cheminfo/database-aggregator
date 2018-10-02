import { join } from 'path';

import { globalConfig as config } from './config/config';
import { sources as migrateSources } from './migration';
import { connect } from './mongo/connection';
import { save, updateOutstandingTasks } from './mongo/models/schedulerLog';
import { debugUtil } from './util/debug';

import { ProcessScheduler } from 'process-scheduler';
import { IScheduleDefinition } from './internalTypes';
import {
  getCopyMissingIdTaskId,
  getCopyTaskId,
  getRemoveTaskId
} from './util/names';

const debug = debugUtil('bin:schedule');

const sources = Object.keys(config.source);
const aggregations = Object.keys(config.aggregation);

let hasStarted = false;
let resolveScheduler: (scheduler: ProcessScheduler) => any;
const schedulerPromise: Promise<ProcessScheduler> = new Promise((resolve) => {
  resolveScheduler = resolve;
});

export async function start() {
  if (hasStarted) {
    return;
  }
  await connect();
  const schedulerConfig = {
    threads: {
      source: config.schedulerThreadsSource,
      aggregation: config.schedulerThreadsAggregation
    }
  };

  const scheduleDefinition: IScheduleDefinition[] = [];
  // Create configuration
  for (const collection of sources) {
    const sourceConfig = config.source[collection];
    const copyConfig: IScheduleDefinition = {
      id: getCopyTaskId(collection),
      worker: join(__dirname, '../src/source/workers/copyWorker.js'),
      immediate: false,
      deps: [],
      noConcurrency: [
        getRemoveTaskId(collection),
        getCopyMissingIdTaskId(collection)
      ],
      arg: collection,
      type: 'source'
    };
    scheduleDefinition.push(copyConfig);

    const copyMissingConfig: IScheduleDefinition = {
      id: getCopyMissingIdTaskId(collection),
      worker: join(__dirname, '../src/source/workers/copyMissingIdsWorker.js'),
      immediate: false,
      deps: [],
      noConcurrency: [],
      arg: collection,
      type: 'source'
    };
    scheduleDefinition.push(copyMissingConfig);

    const removeConfig: IScheduleDefinition = {
      id: getRemoveTaskId(collection),
      worker: join(__dirname, '../src/source/workers/removeWorker.js'),
      immediate: false,
      deps: [],
      noConcurrency: [],
      arg: collection,
      type: 'source'
    };
    scheduleDefinition.push(removeConfig);

    if (!config.source[collection].disabled) {
      copyConfig.cronRule = sourceConfig.copyCronRule;
      copyMissingConfig.cronRule = sourceConfig.copyMissingIdsCronRule;
      removeConfig.cronRule = sourceConfig.removeCronRule;
    }
  }

  for (const collection of aggregations) {
    const aggregationConfig = config.aggregation[collection];
    const aggId = `aggregation_${collection}`;
    scheduleDefinition.push({
      id: aggId,
      worker: join(__dirname, '../src/aggregation/worker.js'),
      immediate: false,
      deps: [],
      noConcurrency: [],
      arg: collection,
      type: 'aggregation'
    });

    if (!aggregationConfig.disabled) {
      const aggSources = Object.keys(config.aggregation[collection].sources);
      for (const source of aggSources) {
        setDeps(getCopyTaskId(source), aggId);
        setDeps(getRemoveTaskId(source), aggId);
        setDeps(getCopyMissingIdTaskId(source), aggId);
      }
    }
  }

  function setDeps(name: string, aggId: string) {
    const scheduleRule = scheduleDefinition.find((s) => s.id === name);
    if (scheduleRule) {
      scheduleRule.deps.push(aggId);
      scheduleRule.noConcurrency.push(aggId);
    }
  }

  // We run migration scripts before starting the scheduler
  await migrateSources(config.source);
  // Sanitize the database
  await updateOutstandingTasks();

  debug.trace(`scheduler config${schedulerConfig}`);
  const scheduler = new ProcessScheduler(schedulerConfig);

  scheduler.on('change', (data) => {
    save(data);
  });
  scheduler.schedule(scheduleDefinition);

  hasStarted = true;
  resolveScheduler(scheduler);
}

export async function triggerTask(taskId: string) {
  const scheduler = await schedulerPromise;
  scheduler.trigger(taskId);
}
