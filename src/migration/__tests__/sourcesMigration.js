'use strict';

const mongoSetup = require('../../../test/mongoSetup');

// const { clean } = require('../../../test/util');
const migration = require('..');

beforeEach(async () => {
  await mongoSetup.connect();
  await mongoSetup.insertData('chemicals.json');
  await mongoSetup.insertData('source_sequence.yaml');
});
afterEach(mongoSetup.disconnect);

const model = require('../../mongo/model');
const sourceSequence = require('../../mongo/models/sourceSequence');

const MISCELANEOUS = 'miscelaneous';

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
      miscelaneous: {
        version: 0
      }
    };
    await migration.sources(conf);
    const data = await getMiscData();
    expect(data).toEqual(originalData);
  });

  it('drop database when version number is incremented', async () => {
    let dbVersion = await sourceSequence.getSourceVersion(MISCELANEOUS);
    expect(dbVersion).toEqual(0);

    const conf = {
      [MISCELANEOUS]: {
        version: 1
      }
    };

    await migration.sources(conf);
    dbVersion = await sourceSequence.getSourceVersion(MISCELANEOUS);
    expect(dbVersion).toEqual(1);
    const data = await getMiscData();
    expect(data).toHaveLength(0);
  });
});
