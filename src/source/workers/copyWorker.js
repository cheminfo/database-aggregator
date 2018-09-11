'use strict';

const config = require('../../config/config').globalConfig;
const { connect } = require('../../mongo/connection');
const { copy } = require('../copy');

process.on('message', (sourceDB) => {
  (async function() {
    try {
      await connect();
      await copy(config.source[sourceDB]);
    } catch (e) {
      // tslint:disable-next-line no-console
      console.error(e);
      process.exit(1);
    }
    process.exit(0);
  })();
});
