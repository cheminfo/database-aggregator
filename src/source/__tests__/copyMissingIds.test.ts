import {
  connect,
  disconnect,
  dropDatabase,
  insertData
} from '../../../test/mongoSetup';
import { clean, getCollection } from '../../../test/util';
import { copyMissingIds } from '../copyMissingIds';
import { ISourceConfigElement } from '../../internalTypes';

beforeAll(connect);
afterAll(disconnect);

const collection = getCollection('source_test');
const config: ISourceConfigElement = {
  driver: {
    getIds(driverConfig) {
      const data = ['test1', 'test2', 'test3'];
      if (driverConfig.type === 'set') {
        return new Set(data);
      }
      return data;
    },
    getData(driverConfig, callback, options) {
      if (!options.ids) {
        throw new Error('unexpected');
      }
      if (options.ids.length > 1) {
        throw new Error('unexpected');
      }
      return callback([
        {
          id: 'test3',
          commonID: 'test3',
          modificationDate: new Date(0),
          data: { test: 3 }
        }
      ]);
    }
  },
  driverConfig: {},
  collection: 'test'
};

const testData = {
  meta_source_sequence: [
    {
      _id: 'test',
      seq: 2
    }
  ],
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
    }
  ]
};

describe('source copyMissingIds', () => {
  beforeEach(async () => {
    await dropDatabase();
    await insertData(testData);
  });
  it('should copy missing entries', async () => {
    await copyMissingIds(config);
    const data = await collection.find().toArray();
    expect(data[2].data).toEqual({ test: 3 });
    expect(clean(data)).toMatchSnapshot();
  });

  it('should copy missing entries when driver returns a set', async () => {
    await copyMissingIds(
      Object.assign(config, { driverConfig: { type: 'set' } })
    );
    const data = await collection.find().toArray();
    expect(data[2].data).toEqual({ test: 3 });
    expect(clean(data)).toMatchSnapshot();
  });
});
