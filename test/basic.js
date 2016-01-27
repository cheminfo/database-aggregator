'use strict';

const connection = require('../src/mongo/connection');
const data = require('./data/data');

describe('database connection', function () {
    before(data);
    it('Should successfully create a connection to mongodb', function () {
        return connection();
    });
});