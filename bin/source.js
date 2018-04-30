'use strict';

const pid = require('../src/util/pid');
const { connect } = require('../src/mongo/connection');
const debug = require('../src/util/debug')('bin:source');
const copy = require('../src/source/copy');
const config = require('../src/config/config').globalConfig;

pid.start();

const sources = Object.keys(config.source);

if (sources.length === 0) {
  console.log('no source found in config');
}

(async function () {
  await connect();
  for (const collection of sources) {
    let start = new Date().getTime();
    debug(`Begin sourcing of ${collection}`);
    const options = config.source[collection];
    try {
      await copy(options);
    } catch (e) {
      console.error(e);
    }
    let end = new Date().getTime();
    let time = end - start;
    debug(`End sourcing of ${collection} in ${time}ms`);
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
