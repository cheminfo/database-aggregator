'use strict';

const aggregate = require('./aggregate');
const Promise = require('bluebird');
const connection = require('../mongo/connection');

process.on('message', aggregateDB => {
    Promise.coroutine(function* () {
        try {
            yield connection();
            yield aggregate(aggregateDB);
        } catch (e) {
            console.error(e);
            process.exit(1);
            return;
        }
        process.exit(0);
    })();

});
