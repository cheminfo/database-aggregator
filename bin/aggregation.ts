import { aggregate } from '../src/aggregation/aggregate';
import { globalConfig as config } from '../src/config/config';
import { connect } from '../src/mongo/connection';
import { debugUtil } from '../src/util/debug';
import { start, stop } from '../src/util/pid';

const debug = debugUtil('bin:aggregate');

start();

const aggregation = config.aggregation;
const aggregations = Object.keys(aggregation);

(async () => {
  await connect();
  for (const collection of aggregations) {
    const startTime = new Date().getTime();
    debug.debug(`Begin aggregate of ${collection}`);
    try {
      const conf = config.aggregation[collection];
      await aggregate(conf);
    } catch (e) {
      console.error(e);
    }
    const end = new Date().getTime();
    const time = end - startTime;
    debug.debug(`End aggregate of ${collection} in ${time}ms`);
  }
})()
  .then(
    () => {
      console.log('finished');
      return 0;
    },
    e => {
      console.error(e);
      return 1;
    }
  )
  .then(stop);
