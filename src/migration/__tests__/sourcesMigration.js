'use strict';

const mongoSetup = require('../../../test/mongoSetup');

// const { clean } = require('../../../test/util');
const migration = require('..');

beforeEach(mongoSetup.connect);
afterEach(mongoSetup.disconnect);

const model = require('../../mongo/model');
const sourceSequence = require('../../mongo/models/sourceSequence');

const MISCELANEOUS = 'miscelaneous';

describe('source migration', () => {
  it('drop database when version number is incremented', async () => {
    const miscelaneous = model.getSource(MISCELANEOUS);
    await mongoSetup.insertData('chemicals.json');
    await mongoSetup.insertData('source_sequence.yaml');
    let data = await miscelaneous
      .find({})
      .lean()
      .exec();
    expect(data.length).toBeGreaterThan(0);
    let conf = {
      miscelaneous: {
        version: 0
      }
    };
    await migration.sources(conf);
    data = await miscelaneous
      .find({})
      .lean()
      .exec();
    expect(data.length).toBeGreaterThan(0);
    let dbVersion = await sourceSequence.getSourceVersion(MISCELANEOUS);
    expect(dbVersion).toEqual(0);

    conf = {
      [MISCELANEOUS]: {
        version: 1
      }
    };

    await migration.sources(conf);
    dbVersion = await sourceSequence.getSourceVersion(MISCELANEOUS);
    expect(dbVersion).toEqual(1);
    data = await miscelaneous
      .find({})
      .lean()
      .exec();
    expect(data).toHaveLength(0);
  });
});
