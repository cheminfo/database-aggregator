'use strict';

const aggregate = require('./aggregate');

process.on('message', aggregateDB => {
    try {
        yield aggregate(aggregateDB);
    } catch (e) {
        console.error(e);
        return process.exit(1);
    }
    process.exit(0);
});