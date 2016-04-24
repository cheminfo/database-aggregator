'use strict';

const source = require('./source');

process.on('message', options => {
    try {
        yield source.remove(options);
    } catch(e) {
        console.error(e);
        return process.exit(1);
    }

    process.exit(0);
});