'use strict';

const aggregate = require('../src/aggregation/aggregate');

const data = require('./data/data');

describe('Aggregation', function () {
  beforeEach(data);
  it('Should create aggregated collection', function () {
    return aggregate('chemical');
  });
});
