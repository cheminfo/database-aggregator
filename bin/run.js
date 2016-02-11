'use strict';

const Promise = require('bluebird');
const wait = require('../src/util/wait');
const debug = require('../src/util/debug')('aggregate:run');
const connection = require('../src/mongo/connection');
const baseIdle = 6000; // 1 minute idle

// Config
const config = require('../src/config/config').globalConfig;
const aggregation = config.aggregation;
const source = config.source;
const sources = Object.keys(source);
const aggregations = Object.keys(aggregation);

//const copy = require('../src/source/copy');
const aggregate = require('../src/aggregation/aggregate');

const syncHistory = require('../src/mongo/models/syncHistory');

const doOne = Promise.coroutine(function * (type, collection) {
    var options;
    if(type === 'source') {
        options = source[collection];
    } else {
        options = aggregation[collection];
    }
    const interval = (options.interval || config.interval) * 1000;
    try {
        var lastSync = yield syncHistory.getLast(type, collection);
        if(lastSync) lastSync = lastSync.date;
        if(!lastSync || Date.now() - lastSync.getTime() > interval) {
            if(type === 'source') {
                yield copy.copy(Object.assign({collection}, options));
            } else {
                yield aggregate(collection);
            }
            debug.debug(`Synced ${collection} successfully`);
            yield syncHistory.save(type, collection, 'success');
        } else {
            debug.trace(`Skipping sync of ${collection} of type ${type}`);
        }
    } catch(e) {
        debug.error(`Error syncing source ${collection}: ${e}`);
        yield syncHistory.save('source', collection, 'failure: ' + e.message);
    }
});

Promise.coroutine(function* () {
    yield connection();
    while (true) {
        for (const collection of sources) {
            yield doOne('source', collection);
        }

        for (const collection of aggregations) {
            yield doOne('aggregation', collection);
        }

        yield wait(baseIdle);
    }
})();
