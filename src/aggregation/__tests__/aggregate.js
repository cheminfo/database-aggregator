'use strict';

const mongoSetup = require('../../../test/mongoSetup');
const aggregate = require('../aggregate');

const aggregation = require('./../../mongo/models/aggregation');

beforeEach(mongoSetup.connect);
afterEach(mongoSetup.disconnect);

describe('aggregation', () => {
  it('one-shot chemical sources aggregation', async () => {
    await mongoSetup.insertData('chemicals.json');
    const conf = {
      collection: 'chemical',
      sources: {
        miscelaneous(values, result) {
          if (values && values[0]) {
            var value = values[0];
            result.mf = {};
            result.mf.value = value.mf;
            result.mf.exactMass = value.exactMass;
            result.mf.mw = value.mw;
            result.info = {};
            result.info.rn = value.rn;
          }
        },
        prices(values, result) {
          result.prices = values;
        },
        names(values, result) {
          result.names = values.map((value) => value.name);
        }
      }
    };
    await aggregate(conf);
    let data = await aggregation.findAll('chemical');
    data.forEach((d) => {
      d.date = null;
    });
    expect(data).toMatchSnapshot();
  });
});
