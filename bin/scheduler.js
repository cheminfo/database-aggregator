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

const REMOVE_ID = 'source_remove_';
const COPY_ID = 'source_copy_';
const COPY_MISSING_ID = 'source_copy_missing_ids_';

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
            id: COPY_ID + collection,
            worker: path.join(__dirname, '../src/source/copyWorker.js'),
            immediate: false,
            cronRule: config.source[collection].copyCronRule,
            deps: [],
            noConcurrency: [REMOVE_ID + collection, COPY_MISSING_ID + collection],
            arg: config.source[collection],
            type: 'source'
        });
        // copy missing ids
        schedule.push({
            id: COPY_MISSING_ID + collection,
            worker: path.join(__dirname, '../src/source/copyMissingIdsWorker.js'),
            immediate: false,
            cronRule: config.source[collection].copyMissingIdsCronRule,
            deps: [],
            noConcurrency: [],
            arg: config.source[collection],
            type: 'source'
        });
        schedule.push({
            id: REMOVE_ID + collection,
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
            setDeps(COPY_ID + source, aggId);
            setDeps(REMOVE_ID + source, aggId);
            setDeps(COPY_MISSING_ID + source, aggId);
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
