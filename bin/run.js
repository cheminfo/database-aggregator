'use strict';

const Promise = require('bluebird');
const wait = require('../src/util/wait');
const debug = require('../src/util/debug')('aggregate:run');
const connection = require('../src/mongo/connection');
const baseIdle = 6000; // 1 minute idle

// Config
const config = require('../src/config/config').globalConfig;
const sources = Object.keys(config.source);
const aggregations = Object.keys(config.aggregation);

const source = require('../src/source/source');
const aggregate = require('../src/aggregation/aggregate');

const syncHistory = require('../src/mongo/models/syncHistory');

const doOne = Promise.coroutine(function * (type, operation, collection) {
    var options, interval;
    if(type === 'source') {
        options = config.source[collection];
    } else {
        options = config.aggregation[collection];
    }

    if(operation === 'update') {
        interval = (options.updateInterval || config.updateInterval) * 1000;
    } else {
        interval = (options.deleteInterval || config.deleteInterval) * 1000;
    }
    try {
        var lastSync = yield syncHistory.getLast(type, operation, collection);
        if(lastSync) lastSync = lastSync.date;
        if(!lastSync || Date.now() - lastSync.getTime() > interval) {
            if(type === 'source' && operation === 'update') {
                yield source.copy(Object.assign({collection}, options));
            } else if(type === 'source' && operation === 'delete') {
                yield source.remove(Object.assign({collection}, options));
            }  else if (type === 'aggregation') {
                yield aggregate(collection);
            }
            debug.debug(`Synced ${collection} successfully`);
            yield syncHistory.save(type, operation, collection, 'success');
        } else {
            debug.trace(`Skipping sync of ${collection} of type ${type} and operation ${operation}`);
        }
    } catch(e) {
        debug.error(`Error syncing source ${collection}: ${e}`);
        yield syncHistory.save('source', operation, collection, 'failure: ' + e.message);
    }
});

Promise.coroutine(function* () {
    yield connection();
    while (true) {
        for (const collection of sources) {
            yield doOne('source', 'update', collection);
            yield doOne('source', 'delete', collection);
        }

        for (const collection of aggregations) {
            yield doOne('aggregation', 'update', collection);
        }

        yield wait(baseIdle);
    }
})();
