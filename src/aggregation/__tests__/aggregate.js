'use strict';

const mongoSetup = require('../../../test/mongoSetup');
const aggregate = require('../aggregate');

const aggregation = require('./../../mongo/models/aggregation');

beforeAll(mongoSetup.connect);
afterAll(mongoSetup.disconnect);

describe('source copy', () => {
  beforeEach(() => mongoSetup.insertData('chemicals.json'));
  it('aggregate chemical', async () => {
    await aggregate('chemical');
    let data = await aggregation.findAll('chemical');
    data.forEach((d) => {
      d.date = null;
    });
    expect(data).toMatchSnapshot();
  });
});
