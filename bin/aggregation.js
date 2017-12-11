'use strict';

const Promise = require('bluebird');
const pid = require('../src/util/pid');
const connection = require('../src/mongo/connection');
const debug = require('../src/util/debug')('bin:aggregate');

pid.start();

const aggregate = require('../src/aggregation/aggregate');
const config = require('../src/config/config').globalConfig;

const aggregation = config.aggregation;
const aggregations = Object.keys(aggregation);

Promise.coroutine(function* () {
    yield connection();
    for (const collection of aggregations) {
        let start = new Date().getTime();
        debug(`Begin aggregate of ${collection}`);
        try {
            yield aggregate(collection);
        } catch (e) {
            console.error(e);
        }
        let end = new Date().getTime();
        let time = end - start;
        debug(`End aggregate of ${collection} in ${time}ms`);
    }
})().then(function () {
    console.log('finished');
    return 0;
}, function (e) {
    console.error(e);
    return 1;
}).then(pid.stop);

