import { sources } from '..';
import { connect, disconnect, insertData } from '../../../test/mongoSetup';
import { getSource } from '../../mongo/model';
import { getSourceVersion } from '../../mongo/models/sourceSequence';

beforeEach(async () => {
  await connect();
  await insertData('chemicals.json');
  await insertData('source_sequence.yaml');
});
afterEach(disconnect);

const MISCELANEOUS = 'miscelaneous';
const NAMES = 'names';

function getMiscData() {
  const miscelaneous = getSource(MISCELANEOUS);
  return miscelaneous
    .find({})
    .lean()
    .exec();
}

describe('source migration', () => {
  it('no migration when version numbers are equal', async () => {
    const originalData = await getMiscData();
    const conf = {
      miscelaneous: {
        collection: 'none',
        driver: 'none',
        version: 0
      }
    };
    // @ts-ignore
    await sources(conf);
    const data = await getMiscData();
    expect(data).toEqual(originalData);
  });

  it('drop database when version number is incremented', async () => {
    const conf = {
      [MISCELANEOUS]: {
        collection: 'none',
        driver: 'none',
        version: 1
      }
    };
    // @ts-ignore
    await sources(conf);
    const dbVersion = await getSourceVersion(MISCELANEOUS);
    expect(dbVersion).toEqual(1);
    const data = await getMiscData();
    expect(data).toHaveLength(0);
  });

  it('throw when config version is small than current version', () => {
    const conf = {
      [MISCELANEOUS]: {
        collection: 'none',
        driver: 'none',
        version: -1
      }
    };
    // @ts-ignore
    return expect(sources(conf)).rejects.toEqual(
      new Error(
        'source version in config must be greater than current version. config version is -1 and current version is 0'
      )
    );
  });

  it('no migration if config version is undefined', async () => {
    const originalData = await getMiscData();
    const conf = {
      [MISCELANEOUS]: {}
    };
    // @ts-ignore
    await sources(conf);
    const data = await getMiscData();
    expect(data).toEqual(originalData);
  });

  it('throw when version exists but is not defined in config', () => {
    const conf = {
      [NAMES]: {}
    };
    // @ts-ignore
    return expect(sources(conf)).rejects.toEqual(
      new Error(
        'source version is 1 but version in source config is not defined'
      )
    );
  });

  it('real migrations are not supported yet', () => {
    const conf = {
      [MISCELANEOUS]: {
        version: 1,
        migration: () => {
          // noop
        }
      }
    };

    // @ts-ignore
    return expect(sources(conf)).rejects.toThrow(
      'migration scripts not implemented yet'
    );
  });
});
