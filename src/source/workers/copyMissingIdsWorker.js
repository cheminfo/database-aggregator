'use strict';

const { connect } = require('../../mongo/connection');
const copyMissingIds = require('../copyMissingIds');

process.on('message', (options) => {
  (async function () {
    try {
      await connect();
      await copyMissingIds(options);
    } catch (e) {
      console.error(e);
      process.exitCode = 1;
    }
  })();
});
