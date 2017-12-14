'use strict';

const source = require('./source');
const Promise = require('bluebird');
const connection = require('../mongo/connection');

process.on('message', options => {
    Promise.coroutine(function * () {
        try {
            yield connection();
            yield source.copyMissingIds(options);
        } catch (e) {
            console.error(e);
            process.exit(1);
            return;
        }
        process.exit(0);
    })();

});
