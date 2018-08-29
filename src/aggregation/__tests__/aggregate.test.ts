import { connect, disconnect, insertData } from '../../../test/mongoSetup';
import { clean } from '../../../test/util';
import { aggregate } from '../aggregate';
const aggregation = require('./../../mongo/models/aggregation');

beforeEach(connect);
afterEach(disconnect);

describe('aggregation', () => {
  it('one-shot chemical sources aggregation', async () => {
    await insertData('chemicals.json');
    const conf = {
      collection: 'chemical',
      sources: {
        miscelaneous(values, result) {
          if (values && values[0]) {
            const value = values[0];
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
          result.names = values.map(value => value.name);
        }
      }
    };
    await aggregate(conf);
    const data = await aggregation.findAll('chemical').lean();
    data.forEach(d => {
      d.date = null;
    });
    expect(clean(data)).toMatchSnapshot();
  });

  it('various steps of aggregation', async () => {
    const conf = {
      collection: 'sourceAgg',
      sources: {
        // eslint-disable-next-line camelcase
        source_test(values, result) {
          result.values = values.slice();
        }
      }
    };

    let data;

    // Init step
    await insertData('sources1', { drop: true });
    await aggregate(conf);
    data = await aggregation.findAll('sourceAgg').lean();
    aggSnapshot(data);

    // Update data step
    await insertData('sources2', { drop: true });
    await aggregate(conf);
    data = await aggregation.findAll('sourceAgg').lean();
    aggSnapshot(data);

    // Add data step
    await insertData('sources3', { drop: true });
    await aggregate(conf);
    data = await aggregation.findAll('sourceAgg').lean();
    aggSnapshot(data);

    // Delete step
    await insertData('sources4', { drop: true });
    await aggregate(conf);
    data = await aggregation.findAll('sourceAgg').lean();
    aggSnapshot(data);
  });
});

function aggSnapshot(data) {
  data.forEach(d => {
    d.date = null;
  });
  expect(clean(data)).toMatchSnapshot();
}
