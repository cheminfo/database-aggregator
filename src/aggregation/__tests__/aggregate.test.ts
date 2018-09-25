import { connect, disconnect, insertData } from '../../../test/mongoSetup';
import { clean } from '../../../test/util';
import { aggregate } from '../aggregate';
import { getLastSeqIds } from '../../mongo/models/aggregationSequence';
const aggregation = require('./../../mongo/models/aggregation');

beforeEach(connect);
afterEach(disconnect);

describe('aggregation', () => {
  it('one-shot chemical sources aggregation', async () => {
    await insertData('chemicals.json');
    const conf = {
      collection: 'chemical',
      sources: {
        miscelaneous(values: any[], result: any) {
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
        prices(values: any[], result: any) {
          result.prices = values;
        },
        names(values: any[], result: any) {
          result.names = values.map((value) => value.name);
        }
      }
    };
    await aggregate(conf);
    const data = await aggregation.findAll('chemical').lean();
    data.forEach((d: any) => {
      d.date = null;
    });
    const lastSeq = await getLastSeqIds('chemical');
    expect(lastSeq.miscelaneous).toBeGreaterThan(0);
    expect(lastSeq.prices).toBeGreaterThan(0);
    expect(lastSeq.names).toBeGreaterThan(0);
    expect(clean(data)).toMatchSnapshot();
  });

  it('various steps of aggregation', async () => {
    const conf = {
      collection: 'sourceAgg',
      sources: {
        // eslint-disable-next-line camelcase
        source_test(values: any, result: any) {
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

function aggSnapshot(data: any[]) {
  data.forEach((d) => {
    d.date = null;
  });
  expect(clean(data)).toMatchSnapshot();
}
