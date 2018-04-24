'use strict';

const connection = require('../../mongo/connection');
const remove = require('../remove');

process.on('message', (options) => {
  (async function () {
    try {
      await connection();
      await remove(options);
    } catch (e) {
      console.error(e);
      process.exitCode = 1;
    }
  })();
});
