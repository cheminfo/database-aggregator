'use strict';

const mongoSetup = require('../../../test/mongoSetup');
const { getDriverPath, getCollection } = require('../../../test/util');
const copy = require('../copy');

beforeAll(mongoSetup.connect);
afterAll(mongoSetup.disconnect);

describe('source copy 1', () => {
  it('should copy the data', async () => {
    const collection = getCollection('test-source');
    const config = {
      driver: getDriverPath('source-1'),
      driverValue: 2,
      collection: 'test'
    };
    await copy(config);
    console.log('count', await collection.count());
  });
});
