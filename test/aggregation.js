'use strict';

const data = require('./data/data');
const aggregate = require('../src/aggregation/aggregate');

describe('Aggregation', function () {
    before(data);
    it('Should create aggregated collection', function () {
        return aggregate('chemical');
    });
});
