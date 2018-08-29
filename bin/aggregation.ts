import { start, stop } from '../src/util/pid';
import { connect } from '../src/mongo/connection';
import { aggregate } from '../src/aggregation/aggregate';
import { globalConfig as config } from '../src/config/config';
import { debugUtil } from '../src/util/debug';

const debug = debugUtil('bin:aggregate');

start();

const aggregation = config.aggregation;
const aggregations = Object.keys(aggregation);

(async function() {
  await connect();
  for (const collection of aggregations) {
    let start = new Date().getTime();
   debug.debug(`Begin aggregate of ${collection}`);
    try {
      const conf = config.aggregation[collection];
      await aggregate(conf);
    } catch (e) {
      console.error(e);
    }
    let end = new Date().getTime();
    let time = end - start;
   debug.debug(`End aggregate of ${collection} in ${time}ms`);
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