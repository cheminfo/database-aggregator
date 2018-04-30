'use strict';

const pid = require('../src/util/pid');
const { connect } = require('../src/mongo/connection');
const debug = require('../src/util/debug')('bin:source');
const remove = require('../src/source/remove');
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
    debug(`Begin remove source of ${collection}`);
    const options = config.source[collection];
    try {
      await remove(options);
    } catch (e) {
      console.error(e);
    }
    let end = new Date().getTime();
    let time = end - start;
    debug(`End remove source of ${collection} in ${time}ms`);
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
