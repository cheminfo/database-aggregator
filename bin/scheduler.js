'use strict';

const path = require('path');
const Promise = require('bluebird');
const debug = require('../src/util/debug')('bin:schedule');
const connection = require('../src/mongo/connection');

// Config
const config = require('../src/config/config').globalConfig;
const sources = Object.keys(config.source);
const aggregations = Object.keys(config.aggregation);

const syncHistory = require('../src/mongo/models/syncHistory');
const schedulerLog = require('../src/mongo/models/schedulerLog');

const ProcessScheduler = require('process-scheduler');

Promise.coroutine(function* () {
    yield connection();
    const schedulerConfig = {
        threads: 4
    };

    const schedule = [];
    // Create configuration
        for (const collection of sources) {
            schedule.push({
                id: 'source_copy_' + collection,
                worker: path.join(__dirname, '../src/source/copyWorker.js'),
                immediate: false,
                cronRule: config.source[collection].copyCronRule,
                deps: [],
                noConcurrency: ['source_remove_' + collection],
                arg: config.source[collection]
            });
            schedule.push({
                id: 'source_remove_' + collection,
                worker: path.join(__dirname, '../src/source/removeWorker.js'),
                immediate: false,
                cronRule: config.source[collection].removeCronRule,
                deps: [],
                noConcurrency: [],
                arg: config.source[collection]
            });
        }

        for (const collection of aggregations) {
            let aggId = 'aggregation_' + collection;
            schedule.push({
                id: aggId,
                worker: path.join(__dirname, '../src/aggregation/worker.js'),
                immediate: false,
                arg: collection
            });

            let sources = Object.keys(config.aggregation[collection].sources);
            for(const source of sources) {
                let s = schedule.find(s => s.id === 'source_copy_' + source);
                if(s) {
                    s.deps.push(aggId);
                    s.noConcurrency.push(aggId);
                }
                s = schedule.find(s => s.id === 'source_remove_' + source);
                if(s) {
                    s.deps.push(aggId);
                    s.noConcurrency.push(aggId);
                }
            }
        }

    var scheduler = new ProcessScheduler(schedulerConfig);
    scheduler.on('change', function(data) {
        console.log(new Date(), data.id, data.status);
        schedulerLog.save(data);
    });
    scheduler.schedule(schedule);

})();