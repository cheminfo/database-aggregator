import { start } from '../src/util/pid';
import { connect } from '../src/mongo/connection';

const { copyMissingIds } = require('../src/source/copyMissingIds');
import { globalConfig as config } from '../src/config/config';
import { debugUtil } from '../src/util/debug';

const debug = debugUtil('bin:source');
start();

const sources = Object.keys(config.source);

if (sources.length === 0) {
  console.log('no source found in config');
}

(async function() {
  await connect();
  for (const collection of sources) {
    let start = new Date().getTime();
   debug.debug(`Begin copy missing ids of ${collection}`);
    const options = config.source[collection];
    try {
      await copyMissingIds(options);
    } catch (e) {
      console.error(e);
    }
    let end = new Date().getTime();
    let time = end - start;
   debug.debug(`End copy missing ids of ${collection} in ${time}ms`);
  }
})()
  .then(
    function() {
      console.log('finished');
      return 0;
    },
    function(e) {
      console.error(e);
      return 1;
    }
  )
  .then(stop);
