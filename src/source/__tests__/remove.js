'use strict';

const mongoSetup = require('../../../test/mongoSetup');
const { getCollection, clean } = require('../../../test/util');
const remove = require('../remove');

beforeAll(mongoSetup.connect);
afterAll(mongoSetup.disconnect);

const collection = getCollection('source_test');
const config = {
  driver: {
    getIds(config) {
      const data = ['test1', 'test3'];
      if (config.type === 'set') return new Set(data);
      return data;
    },
    getData() {
      // ignore
    }
  },
  collection: 'test'
};

const testData = {
  // eslint-disable-next-line camelcase
  meta_source_sequence: [
    {
      _id: 'test',
      seq: 3
    }
  ],
  // eslint-disable-next-line camelcase
  source_test: [
    {
      id: 'test1',
      commonID: 'test1',
      date: new Date(0),
      sequentialID: 1,
      data: {}
    },
    {
      id: 'test2',
      commonID: 'test2',
      date: new Date(0),
      sequentialID: 2,
      data: {}
    },
    {
      id: 'test3',
      commonID: 'test3',
      date: new Date(0),
      sequentialID: 3,
      data: {}
    }
  ]
};

describe('source remove', () => {
  beforeEach(async () => {
    await mongoSetup.dropDatabase();
    await mongoSetup.insertData(testData);
  });
  it('should ignore remove if threshold is too low', async () => {
    await remove(config);
    const data = await collection.find().toArray();
    expect(data[1].data).toEqual({});
    expect(clean(data)).toMatchSnapshot();
  });

  it('should remove if threshold is high enough', async () => {
    await remove(Object.assign(config, { removeThreshold: 0.9 }));
    const data = await collection.find().toArray();
    expect(data[1].data).toBeNull();
    delete data[1].date;
    expect(clean(data)).toMatchSnapshot();
  });

  it('should remove when driver returns a set', async () => {
    await remove(Object.assign(config, { type: 'set', removeThreshold: 0.9 }));
    const data = await collection.find().toArray();
    expect(data[1].data).toBeNull();
    delete data[1].date;
    expect(clean(data)).toMatchSnapshot();
  });
});
