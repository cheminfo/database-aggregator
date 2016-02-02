'use strict';

const Promise = require('bluebird');
const pid = require('../src/util/pid');
pid.start();

const aggregate = require('../src/aggregation/aggregate');
const config = require('../src/config/config').globalConfig;

const aggregation = config.aggregation;
const aggregations = Object.keys(aggregation);

Promise.coroutine(function* () {
    for (const collection of aggregations) {
        yield aggregate(collection);
    }
})().then(function () {
    console.log('finished');
    return 0;
}, function (e) {
    console.error(e);
    return 1;
}).then(pid.stop);



