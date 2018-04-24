'use strict';

const mongoSetup = require('../../../test/mongoSetup');
const { getDriverPath, getCollection } = require('../../../test/util');
const copy = require('../copy');

beforeAll(mongoSetup.connect);
afterAll(mongoSetup.disconnect);

describe('source copy 1', () => {
  it('should copy the data', async () => {
    const collection = getCollection('source_test');
    const config = {
      driver: getDriverPath('source-1'),
      driverValue: 2,
      collection: 'test'
    };
    await copy(config);
    await expect(collection.count()).resolves.toBe(1);
    await expect(collection.find().toArray()).resolves.toMatchSnapshot();

    await copy(config);
    await expect(collection.count()).resolves.toBe(3);
    await expect(collection.find().toArray()).resolves.toMatchSnapshot();

    await copy(config);
    await expect(collection.count()).resolves.toBe(4);
    await expect(collection.find().toArray()).resolves.toMatchSnapshot();
  });
});
