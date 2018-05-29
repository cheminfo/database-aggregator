'use strict';

const mongoSetup = require('../../../test/mongoSetup');
const { getCollection, clean } = require('../../../test/util');
const copy = require('../copy');

beforeAll(mongoSetup.connect);
afterAll(mongoSetup.disconnect);

const driver = {
  getData(config, callback) {
    return callback([config.entry]);
  },
  getIds() {
    throw new Error('unimplemented');
  }
};

function getEntryCopy(collection, entry) {
  return copy({
    driver,
    collection,
    entry
  });
}

describe('source copy updates', () => {
  it('should not allow to change the commonID', async () => {
    await mongoSetup.insertData({
      // eslint-disable-next-line camelcase
      source_test1: [
        {
          id: 'test1',
          commonID: 'test1',
          sequentialID: 0,
          data: {},
          date: new Date(0)
        }
      ]
    });

    await expect(
      getEntryCopy('test1', {
        id: 'test1',
        commonID: 'test1-updated',
        data: {},
        modificationDate: new Date(1)
      })
    ).rejects.toThrow(/^commonID may not be changed$/);

    const mongoEntry = await getCollection('source_test1').findOne();
    expect(clean(mongoEntry)).toMatchSnapshot();
  });

  it('should not save if nothing changed', async () => {
    await mongoSetup.insertData({
      // eslint-disable-next-line camelcase
      source_test2: [
        {
          id: 'test2',
          commonID: 'test2',
          sequentialID: 0,
          data: {},
          date: new Date(0)
        }
      ]
    });

    await getEntryCopy('test2', {
      id: 'test2',
      commonID: 'test2',
      data: {},
      modificationDate: new Date(0)
    });

    const mongoEntry = await getCollection('source_test2').findOne();
    expect(clean(mongoEntry)).toMatchSnapshot();
  });
});
