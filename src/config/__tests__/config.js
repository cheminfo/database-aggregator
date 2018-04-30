'use strict';

/* eslint-disable no-process-env */
process.env.DATABASE_AGGREGATOR_CUSTOM_PROP = 'test custom prop';
process.env.DATABASE_AGGREGATOR_HOME_DIR = `${__dirname}/../../../test/homeDir`;
/* eslint-enable */

const config = require('../config');

test('load configuration', function () {
  const conf = Object.assign({}, config.globalConfig);
  delete conf.homeDir;
  // Convert all functions to strings
  expect(conf.aggregation).toHaveProperty('chemical');
  const chemAgg = conf.aggregation.chemical;
  expect(chemAgg.sources).toBeDefined();
  expect(chemAgg.sources.prices).toBeInstanceOf(Function);
  expect(chemAgg.sources.names).toBeInstanceOf(Function);
  expect(chemAgg.sources.miscelaneous).toBeInstanceOf(Function);
  delete chemAgg.sources;

  expect(conf).toEqual({
    // Custom config in home directory
    url: 'mongodb://localhost',
    database: '__database-aggregator-test-db',
    // Default config parameters
    port: 6768,
    schedulerThreadsSource: 4,
    schedulerThreadsAggregation: 4,
    removeThreshold: 0.01,
    aggregation: { chemical: { collection: 'chemical' } },
    source: {
      // eslint-disable-next-line camelcase
      test1_001: {
        driver: 'driverXYZ',
        param1: 10,
        param2: 20,
        collection: 'test1_001'
      },
      // eslint-disable-next-line camelcase
      test2_001: {
        driver: 'driverXYZ',
        param1: 100,
        param2: 200,
        collection: 'test2_001'
      },
      test0: { driver: 'driverXYZ', param1: 1, param2: 2, collection: 'test0' }
    },
    // Environment variables
    customProp: 'test custom prop'
  });
});
