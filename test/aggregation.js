'use strict';

const data = require('./data/data');
const aggregation = require('..');

describe('Aggregation', function () {
    before(data);
    it('Should create aggregated collection', function () {
        return aggregation.update('chemical');
    });

    it('Should reject if configuration does not exist', function () {

    })
});