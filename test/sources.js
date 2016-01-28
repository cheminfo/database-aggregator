'use strict';

const data = require('./data/data');
const sources = require('../src/mongo/source');

describe('Sources', function () {
    before(data);
    it('Should create aggregated collection', function () {
        return sources.getCommonIds('names', 0).should.eventually.be.an.Array;
    });
});