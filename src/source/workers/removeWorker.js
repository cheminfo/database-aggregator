'use strict';

const { connect } = require('../../mongo/connection');
const remove = require('../remove');

process.on('message', (options) => {
  (async function () {
    try {
      await connect();
      await remove(options);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
    process.exit(0);
  })();
});
