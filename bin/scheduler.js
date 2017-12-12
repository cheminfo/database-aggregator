'use strict';

const path = require('path');
const Promise = require('bluebird');
const debug = require('../src/util/debug')('bin:schedule');
const connection = require('../src/mongo/connection');

// Config
const config = require('../src/config/config').globalConfig;
const sources = Object.keys(config.source);
const aggregations = Object.keys(config.aggregation);

const schedulerLog = require('../src/mongo/models/schedulerLog');

const ProcessScheduler = require('process-scheduler');

Promise.coroutine(function* () {
    yield connection();
    const schedulerConfig = {
        threads: {
            source: config.schedulerThreadsSource,
            aggregation: config.schedulerThreadsAggregation
        }
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
            noConcurrency: ['source_remove_' + collection, 'source_copy_missing_ids' + collection],
            arg: config.source[collection],
            type: 'source'
        });
        // copy missing ids
        schedule.push({
            id: 'source_copy_missing_ids' + collection,
            worker: path.join(__dirname, '../src/source/copyMissingIdsWorker.js'),
            immediate: false,
            cronRule: config.source[collection].copyMissingIdsCronRule,
            deps: [],
            noConcurrency: [],
            arg: config.source[collection],
            type: 'source'
        });
        schedule.push({
            id: 'source_remove_' + collection,
            worker: path.join(__dirname, '../src/source/removeWorker.js'),
            immediate: false,
            cronRule: config.source[collection].removeCronRule,
            deps: [],
            noConcurrency: [],
            arg: config.source[collection],
            type: 'source'
        });
    }

    for (const collection of aggregations) {
        let aggId = 'aggregation_' + collection;
        schedule.push({
            id: aggId,
            worker: path.join(__dirname, '../src/aggregation/worker.js'),
            immediate: false,
            arg: collection,
            type: 'aggregation'
        });

        let sources = Object.keys(config.aggregation[collection].sources);
        for (const source of sources) {
            setDeps('source_copy_' + source, aggId);
            setDeps('source_remove_' + source, aggId);
            setDeps('source_copy_missing_ids_' + source, aggId);
        }
    }

    function setDeps(name, aggId) {
        let s = schedule.find(s => s.id === name);
        if (s) {
            s.deps.push(aggId);
            s.noConcurrency.push(aggId);
        }
    }

    debug.trace('scheduler config' + schedulerConfig);
    var scheduler = new ProcessScheduler(schedulerConfig);


    scheduler.on('change', function (data) {
        schedulerLog.save(data);
    });
    scheduler.schedule(schedule);

    process.on('message', function (packet) {
        // When sending trigger requests form the web...
        switch (packet.type) {
            case 'scheduler:trigger':
                debug.trace('scheduler:trigger message received' + packet);
                if (packet.data.taskId) {
                    scheduler.trigger(packet.data.taskId);
                }
                break;
            default:
                debug.trace('unknown packet type sent to scheduler');
                break;
        }
    });

})();
