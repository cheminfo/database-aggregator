import { join } from 'path';

import { globalConfig as config } from './config/config';
import { sources as migrateSources } from './migration';
import { connect } from './mongo/connection';
import { save } from './mongo/models/schedulerLog';
import { debugUtil } from './util/debug';

const ProcessScheduler = require('process-scheduler');
const debug = debugUtil('bin:schedule');

const sources = Object.keys(config.source);
const aggregations = Object.keys(config.aggregation);

const REMOVE_ID = 'source_remove_';
const COPY_ID = 'source_copy_';
const COPY_MISSING_ID = 'source_copy_missing_ids_';

let hasStarted = false;
let resolveScheduler: (scheduler: any) => any;
const schedulerPromise: Promise<any> = new Promise(resolve => {
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

  const scheduleDefinition: any[] = [];
  // Create configuration
  for (const collection of sources) {
    scheduleDefinition.push({
      id: COPY_ID + collection,
      worker: join(__dirname, '../src/source/workers/copyWorker.js'),
      immediate: false,
      cronRule: config.source[collection].copyCronRule,
      deps: [],
      noConcurrency: [REMOVE_ID + collection, COPY_MISSING_ID + collection],
      arg: config.source[collection],
      type: 'source'
    });
    // copy missing ids
    scheduleDefinition.push({
      id: COPY_MISSING_ID + collection,
      worker: join(__dirname, '../src/source/workers/copyMissingIdsWorker.js'),
      immediate: false,
      cronRule: config.source[collection].copyMissingIdsCronRule,
      deps: [],
      noConcurrency: [],
      arg: config.source[collection],
      type: 'source'
    });
    scheduleDefinition.push({
      id: REMOVE_ID + collection,
      worker: join(__dirname, '../src/source/workers/removeWorker.js'),
      immediate: false,
      cronRule: config.source[collection].removeCronRule,
      deps: [],
      noConcurrency: [],
      arg: config.source[collection],
      type: 'source'
    });
  }

  for (const collection of aggregations) {
    const aggId = `aggregation_${collection}`;
    scheduleDefinition.push({
      id: aggId,
      worker: join(__dirname, '../src/aggregation/worker.js'),
      immediate: false,
      arg: collection,
      type: 'aggregation'
    });

    const aggSources = Object.keys(config.aggregation[collection].sources);
    for (const source of aggSources) {
      setDeps(COPY_ID + source, aggId);
      setDeps(REMOVE_ID + source, aggId);
      setDeps(COPY_MISSING_ID + source, aggId);
    }
  }

  function setDeps(name: string, aggId: string) {
    const scheduleRule = scheduleDefinition.find(s => s.id === name);
    if (scheduleRule) {
      scheduleRule.deps.push(aggId);
      scheduleRule.noConcurrency.push(aggId);
    }
  }

  // We run migration scripts before starting the scheduler
  await migrateSources(config.source);

  debug.trace(`scheduler config${schedulerConfig}`);
  const scheduler = new ProcessScheduler(schedulerConfig);

  scheduler.on('change', (data: any) => {
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
