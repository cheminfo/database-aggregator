'use strict';

const sources = require('../src/mongo/models/source');

const data = require('./data/data');

describe('Sources', function () {
  beforeEach(data);
  it('Should create aggregated collection', function () {
    return sources.getCommonIds('names', 0).should.eventually.be.an.Array;
  });
});
