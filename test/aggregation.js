'use strict';

const aggregate = require('../src/aggregation/aggregate');

const data = require('./data/data');
const { prepare } = require('./helper');

before(prepare);

describe('Aggregation', function () {
  beforeEach(data);
  it('Should create aggregated collection', function () {
    return aggregate('chemical');
  });
});
