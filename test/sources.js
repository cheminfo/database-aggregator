'use strict';

const sources = require('../src/mongo/models/source');

const data = require('./data/data');
const { prepare } = require('./helper');

before(prepare);

describe('Sources', function () {
  beforeEach(data);
  it('Should create aggregated collection', function () {
    return sources.getCommonIds('names', 0).then((ids) => {
      return ids.should.be.an.Array;
    });
  });
});
