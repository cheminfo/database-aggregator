'use strict';

const Promise = require('bluebird');
const pid = require('../src/util/pid');
const connection = require('../src/mongo/connection');
const debug = require('../src/util/debug')('bin:source');

pid.start();

const source = require('../src/source/source');
const config = require('../src/config/config').globalConfig;

const sources = Object.keys(config.source);

if (sources.length === 0) {
    console.log('no source found in config');
}

Promise.coroutine(function* () {
    yield connection();
    for (const collection of sources) {
        debug.step(`Begin sourcing of ${collection}`);
        const options = config.source[collection];
        try{
            yield source.copy(Object.assign({collection}, options));
        }catch(e){
            console.error(e);
        }
        debug.step(`End sourcing of ${collection}`);
    }
})().then(function () {
    console.log('finished');
    return 0;
}, function (e) {
    console.error(e);
    return 1;
}).then(pid.stop);
