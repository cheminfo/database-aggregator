import { join } from 'path';

import { globalConfig as config } from './config/config';
import { sources as migrateSources } from './migration';
import { connect } from './mongo/connection';
import { save } from './mongo/models/schedulerLog';
import { debugUtil } from './util/debug';

import { ProcessScheduler } from 'process-scheduler';
import {
  getCopyTaskId,
  getCopyMissingIdTaskId,
  getRemoveTaskId
} from './util/names';
import { IScheduleDefinition } from './internalTypes';

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
    if (config.source[collection].disabled) {
      continue;
    }

    scheduleDefinition.push({
      id: getCopyTaskId(collection),
      worker: join(__dirname, '../src/source/workers/copyWorker.js'),
      immediate: false,
      cronRule: config.source[collection].copyCronRule,
      deps: [],
      noConcurrency: [
        getRemoveTaskId(collection),
        getCopyMissingIdTaskId(collection)
      ],
      arg: collection,
      type: 'source'
    });

    // copy missing ids
    scheduleDefinition.push({
      id: getCopyMissingIdTaskId(collection),
      worker: join(__dirname, '../src/source/workers/copyMissingIdsWorker.js'),
      immediate: false,
      cronRule: config.source[collection].copyMissingIdsCronRule,
      deps: [],
      noConcurrency: [],
      arg: collection,
      type: 'source'
    });
    scheduleDefinition.push({
      id: getRemoveTaskId(collection),
      worker: join(__dirname, '../src/source/workers/removeWorker.js'),
      immediate: false,
      cronRule: config.source[collection].removeCronRule,
      deps: [],
      noConcurrency: [],
      arg: collection,
      type: 'source'
    });
  }

  for (const collection of aggregations) {
    if (config.aggregation[collection].disabled) {
      continue;
    }
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

    const aggSources = Object.keys(config.aggregation[collection].sources);
    for (const source of aggSources) {
      setDeps(getCopyTaskId(source), aggId);
      setDeps(getRemoveTaskId(source), aggId);
      setDeps(getCopyMissingIdTaskId(source), aggId);
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
