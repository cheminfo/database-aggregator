'use strict';

const connection = require('../mongo/connection');

const aggregate = require('./aggregate');

process.on('message', (aggregateDB) => {
  (async function () {
    try {
      await connection();
      await aggregate(aggregateDB);
    } catch (e) {
      console.error(e);
      process.exitCode = 1;
    }
  })();
});
