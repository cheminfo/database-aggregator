'use strict';

const Promise = require('bluebird');
const pid = require('../src/util/pid');
const connection = require('../src/mongo/connection');

pid.start();

const copy = require('../src/source/copy');
const config = require('../src/config/config').globalConfig;

const source = config.source;
const sources = Object.keys(source);

if (sources.length === 0) {
    console.log('no source found in config');
}

Promise.coroutine(function* () {
    yield connection();
    for (const collection of sources) {
        const options = source[collection];
        yield copy.copy(Object.assign({collection}, options));
    }
})().then(function () {
    console.log('finished');
    return 0;
}, function (e) {
    console.error(e);
    return 1;
}).then(pid.stop);
