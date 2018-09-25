import {
  connect,
  disconnect,
  dropDatabase,
  insertData
} from '../../../test/mongoSetup';
import { getCollection, clean } from '../../../test/util';
import { remove } from '../remove';
import { ISourceConfigElement } from '../../internalTypes';

beforeAll(connect);
afterAll(disconnect);

const collection = getCollection('source_test');
const config: ISourceConfigElement = {
  driver: {
    getIds: (driverConfig) => {
      const data = ['test1', 'test3'];
      if (driverConfig.type === 'set') {
        return new Set(data);
      }
      return data;
    },
    getData: (x, y, z) => {
      // void
    }
  },
  driverConfig: {},
  collection: 'test'
};

const testData = {
  meta_source_sequence: [
    {
      _id: 'test',
      seq: 3
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
    await dropDatabase();
    await insertData(testData);
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
    await remove(
      Object.assign(config, {
        driverConfig: { type: 'set' },
        removeThreshold: 0.9
      })
    );
    const data = await collection.find().toArray();
    expect(data[1].data).toBeNull();
    delete data[1].date;
    expect(clean(data)).toMatchSnapshot();
  });
});
