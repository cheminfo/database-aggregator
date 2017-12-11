'use strict';

const source = require('./source');
const Promise = require('bluebird');
const connection = require('../mongo/connection');

process.on('message', options => {
    Promise.coroutine(function* () {
        try {
            yield connection();
            yield source.remove(options);
        } catch (e) {
            console.error(e);
            return process.exit(1);
        }
        process.exit(0);
    })();

});
