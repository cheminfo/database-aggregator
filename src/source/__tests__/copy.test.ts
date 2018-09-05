import { connect, disconnect } from '../../../test/mongoSetup';
import { clean, getCollection, getDriverPath } from '../../../test/util';
import { copy } from '../copy';

beforeAll(connect);
afterAll(disconnect);

describe('source copy', () => {
  it('should copy the data', async () => {
    const collection = getCollection('source_test');
    const config = {
      driver: getDriverPath('source-copy'),
      driverConfig: {
        driverValue: 2
      },
      collection: 'test'
    };

    await copy(config);
    await expect(collection.countDocuments()).resolves.toBe(1);
    let data = await collection.find().toArray();
    expect(clean(data)).toMatchSnapshot();

    await copy(config);
    await expect(collection.countDocuments()).resolves.toBe(3);
    data = await collection.find().toArray();
    expect(clean(data)).toMatchSnapshot();

    await copy(config);
    await expect(collection.countDocuments()).resolves.toBe(4);
    data = await collection.find().toArray();
    expect(clean(data)).toMatchSnapshot();

    await copy(config);
    await expect(collection.countDocuments()).resolves.toBe(4);
    const dataAfter = await collection.find().toArray();
    expect(clean(dataAfter)).toEqual(data);
  });

  it('should allow copy with big id', async () => {
    const collection = getCollection('source_test_big');
    const config = {
      driver: getDriverPath('source-copy-big'),
      collection: 'test_big'
    };

    await copy(config);
    const data = await collection.find().toArray();
    expect(clean(data)).toMatchSnapshot();
  });
});
