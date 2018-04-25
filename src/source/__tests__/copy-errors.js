'use strict';

const mongoSetup = require('../../../test/mongoSetup');
const { getCollection } = require('../../../test/util');
const copy = require('../copy');

beforeAll(mongoSetup.connect);
afterAll(mongoSetup.disconnect);

const collection = getCollection('source_test');

const driver = {
  getData(config, callback) {
    return callback([config.entry]);
  },
  getIds() {
    throw new Error('unimplemented');
  }
};

function getEntryCopy(entry) {
  return copy({
    driver,
    testCase: 'entry',
    collection: 'test',
    entry
  });
}

describe('source copy errors', () => {
  it('should throw if no id', async () => {
    await expect(getEntryCopy({})).rejects.toThrow(
      /^entry.id must be a string$/
    );

    await expect(getEntryCopy({ id: 1 })).rejects.toThrow(
      /^entry.id must be a string$/
    );

    return expect(collection.count()).resolves.toBe(0);
  });

  it('should throw if no commonID', async () => {
    await expect(getEntryCopy({ id: 'test' })).rejects.toThrow(
      /^entry.commonID must be a string$/
    );

    await expect(getEntryCopy({ id: 'test', commonID: 1 })).rejects.toThrow(
      /^entry.commonID must be a string$/
    );

    return expect(collection.count()).resolves.toBe(0);
  });

  it('should throw if no modificationDate', async () => {
    await expect(
      getEntryCopy({
        id: 'test',
        commonID: 'test1'
      })
    ).rejects.toThrow(/^entry.modificationDate must be a Date object$/);

    await expect(
      getEntryCopy({
        id: 'test',
        commonID: 'test1',
        modificationDate: 42
      })
    ).rejects.toThrow(/^entry.modificationDate must be a Date object$/);

    return expect(collection.count()).resolves.toBe(0);
  });

  it('should throw if no data', async () => {
    await expect(
      getEntryCopy({
        id: 'test',
        commonID: 'test1',
        modificationDate: new Date()
      })
    ).rejects.toThrow(/^entry.data must be an object$/);

    await expect(
      getEntryCopy({
        id: 'test',
        commonID: 'test1',
        modificationDate: new Date(),
        data: null
      })
    ).rejects.toThrow(/^entry.data must be an object$/);

    await expect(
      getEntryCopy({
        id: 'test',
        commonID: 'test1',
        modificationDate: new Date(),
        data: 42
      })
    ).rejects.toThrow(/^entry.data must be an object$/);

    return expect(collection.count()).resolves.toBe(0);
  });
});