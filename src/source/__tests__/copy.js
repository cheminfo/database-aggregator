'use strict';

const mongoSetup = require('../../../test/mongoSetup');
const { getDriverPath, getCollection } = require('../../../test/util');
const copy = require('../copy');

beforeAll(mongoSetup.connect);
afterAll(mongoSetup.disconnect);

describe('source copy', () => {
  it('should copy the data', async () => {
    const collection = getCollection('source_test');
    const config = {
      driver: getDriverPath('source-copy'),
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
    const data = await collection.find().toArray();
    expect(data).toMatchSnapshot();

    await copy(config);
    await expect(collection.count()).resolves.toBe(4);
    const dataAfter = await collection.find().toArray();
    expect(dataAfter).toEqual(data);
  });
});
