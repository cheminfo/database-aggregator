'use strict';

const connection = require('../../mongo/connection');
const copyMissingIds = require('../copyMissingIds');

process.on('message', (options) => {
  (async function () {
    try {
      await connection();
      await copyMissingIds(options);
    } catch (e) {
      console.error(e);
      process.exitCode = 1;
    }
  })();
});
