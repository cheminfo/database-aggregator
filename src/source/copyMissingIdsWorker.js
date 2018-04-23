'use strict';

const connection = require('../mongo/connection');

const source = require('./source');

process.on('message', (options) => {
  (async function () {
    try {
      await connection();
      await source.copyMissingIds(options);
    } catch (e) {
      console.error(e);
      process.exitCode = 1;
    }
  })();
});
