'use strict';

const pid = require('../src/util/pid');
const connection = require('../src/mongo/connection');
const debug = require('../src/util/debug')('bin:source');
const source = require('../src/source/source');
const config = require('../src/config/config').globalConfig;

pid.start();

const sources = Object.keys(config.source);

if (sources.length === 0) {
  console.log('no source found in config');
}

(async function () {
  await connection();
  for (const collection of sources) {
    let start = new Date().getTime();
    debug(`Begin coy missing ids of ${collection}`);
    const options = config.source[collection];
    try {
      await source.copyMissingIds(options);
    } catch (e) {
      console.error(e);
    }
    let end = new Date().getTime();
    let time = end - start;
    debug(`End copy missing ids of ${collection} in ${time}ms`);
  }
})()
  .then(
    function () {
      console.log('finished');
      return 0;
    },
    function (e) {
      console.error(e);
      return 1;
    }
  )
  .then(pid.stop);
