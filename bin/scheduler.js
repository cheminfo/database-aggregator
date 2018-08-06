'use strict';

const path = require('path');

const ProcessScheduler = require('process-scheduler');
const pm2Bridge = require('pm2-bridge');

const debug = require('../src/util/debug')('bin:schedule');
const { connect } = require('../src/mongo/connection');
const config = require('../src/config/config').globalConfig;
const schedulerLog = require('../src/mongo/models/schedulerLog');
const { sources: migrateSources } = require('../src/migration');

const sources = Object.keys(config.source);
const aggregations = Object.keys(config.aggregation);

const REMOVE_ID = 'source_remove_';
const COPY_ID = 'source_copy_';
const COPY_MISSING_ID = 'source_copy_missing_ids_';

(async function () {
  await connect();
  const schedulerConfig = {
    threads: {
      source: config.schedulerThreadsSource,
      aggregation: config.schedulerThreadsAggregation
    }
  };

  const scheduleDefinition = [];
  // Create configuration
  for (const collection of sources) {
    scheduleDefinition.push({
      id: COPY_ID + collection,
      worker: path.join(__dirname, '../src/source/workers/copyWorker.js'),
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
      worker: path.join(
        __dirname,
        '../src/source/workers/copyMissingIdsWorker.js'
      ),
      immediate: false,
      cronRule: config.source[collection].copyMissingIdsCronRule,
      deps: [],
      noConcurrency: [],
      arg: config.source[collection],
      type: 'source'
    });
    scheduleDefinition.push({
      id: REMOVE_ID + collection,
      worker: path.join(__dirname, '../src/source/workers/removeWorker.js'),
      immediate: false,
      cronRule: config.source[collection].removeCronRule,
      deps: [],
      noConcurrency: [],
      arg: config.source[collection],
      type: 'source'
    });
  }

  for (const collection of aggregations) {
    let aggId = `aggregation_${collection}`;
    scheduleDefinition.push({
      id: aggId,
      worker: path.join(__dirname, '../src/aggregation/worker.js'),
      immediate: false,
      arg: collection,
      type: 'aggregation'
    });

    let sources = Object.keys(config.aggregation[collection].sources);
    for (const source of sources) {
      setDeps(COPY_ID + source, aggId);
      setDeps(REMOVE_ID + source, aggId);
      setDeps(COPY_MISSING_ID + source, aggId);
    }
  }

  function setDeps(name, aggId) {
    let s = scheduleDefinition.find((s) => s.id === name);
    if (s) {
      s.deps.push(aggId);
      s.noConcurrency.push(aggId);
    }
  }

  // We run migration scripts before starting the scheduler
  await migrateSources(config.source);

  debug.trace(`scheduler config${schedulerConfig}`);
  var scheduler = new ProcessScheduler(schedulerConfig);

  scheduler.on('change', function (data) {
    schedulerLog.save(data);
  });
  scheduler.schedule(scheduleDefinition);

  pm2Bridge.onMessage(function (message, context) {
    const data = message.data;
    switch (data.type) {
      case 'scheduler:trigger':
        debug.trace(`scheduler:trigger message received${data.data}`);
        if (data.data.taskId) {
          const status = scheduler.trigger(data.data.taskId);
          if (status) {
            context.reply({
              error: 'process id was not found'
            });
          } else {
            context.reply({
              ok: true
            });
          }
        } else {
          context.reply({
            error: 'taskId parameter is mandatory'
          });
        }
        break;
      default:
        debug.trace('unknown packet type sent to scheduler');
        break;
    }
  });
})();
