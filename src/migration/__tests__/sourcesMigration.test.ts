import { connect, disconnect, insertData } from '../../../test/mongoSetup';
import { sources } from '..';

beforeEach(async () => {
  await connect();
  await insertData('chemicals.json');
  await insertData('source_sequence.yaml');
});
afterEach(disconnect);

const model = require('../../mongo/model');
const sourceSequence = require('../../mongo/models/sourceSequence');

const MISCELANEOUS = 'miscelaneous';
const NAMES = 'names';

function getMiscData() {
  const miscelaneous = model.getSource(MISCELANEOUS);
  return miscelaneous
    .find({})
    .lean()
    .exec();
}

describe('source migration', () => {
  it('no migration when version numbers are equal', async () => {
    const originalData = await getMiscData();
    let conf = {
      [MISCELANEOUS]: {
        version: 0
      }
    };
    await sources(conf);
    const data = await getMiscData();
    expect(data).toEqual(originalData);
  });

  it('drop database when version number is incremented', async () => {
    const conf = {
      [MISCELANEOUS]: {
        version: 1
      }
    };

    await migration.sources(conf);
    const dbVersion = await sourceSequence.getSourceVersion(MISCELANEOUS);
    expect(dbVersion).toEqual(1);
    const data = await getMiscData();
    expect(data).toHaveLength(0);
  });

  it('throw when config version is small than current version', () => {
    const conf = {
      [MISCELANEOUS]: {
        version: -1
      }
    };

    return expect(migration.sources(conf)).rejects.toEqual(
      new Error(
        'source version in config must be greater than current version. config version is -1 and current version is 0'
      )
    );
  });

  it('no migration if config version in undefined', async () => {
    const originalData = await getMiscData();
    let conf = {
      [MISCELANEOUS]: {}
    };
    await migration.sources(conf);
    const data = await getMiscData();
    expect(data).toEqual(originalData);
  });

  it('throw when version exists but is not defined in config', () => {
    let conf = {
      [NAMES]: {}
    };
    return expect(migration.sources(conf)).rejects.toEqual(
      new Error(
        'source version is 1 but version in source config is not defined'
      )
    );
  });

  it('real migrations are not supported yet', () => {
    let conf = {
      [MISCELANEOUS]: {
        version: 1,
        migration: () => {
          // noop
        }
      }
    };

    return expect(migration.sources(conf)).rejects.toThrow(
      'migration scripts not implemented yet'
    );
  });
});
