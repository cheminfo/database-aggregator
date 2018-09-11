'use strict';

const config = require('../../config/config').globalConfig;
const { connect } = require('../../mongo/connection');
const { copyMissingIds } = require('../copyMissingIds');

process.on('message', (sourceDB) => {
  (async function() {
    try {
      await connect();
      await copyMissingIds(config.source[sourceDB]);
    } catch (e) {
      // tslint:disable-next-line no-console
      console.error(e);
      process.exit(1);
    }
    process.exit(0);
  })();
});
