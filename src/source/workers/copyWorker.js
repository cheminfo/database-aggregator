'use strict';

const { connect } = require('../../mongo/connection');
const copy = require('../copy');

process.on('message', (options) => {
  (async function () {
    try {
      await connect();
      await copy(options);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
    process.exit(0);
  })();
});
