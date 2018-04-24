'use strict';

const connection = require('../../mongo/connection');
const copy = require('../copy');

process.on('message', (options) => {
  (async function () {
    try {
      await connection();
      await copy(options);
    } catch (e) {
      console.error(e);
      process.exitCode = 1;
    }
  })();
});
