'use strict';

const mongodb = require('../../src/mongodb');

describe('database connection', function () {
    it('Should successfully create a connection to mongodb', function () {
        return mongodb('test');
    });
});