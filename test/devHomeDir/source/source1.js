'use strict';

/** @type {import('../../../src/types').ISourceConfigFile} */
const source = {
  copyCronRule: '*/1 * * * *',
  removeCronRule: '*/15 * * * *',
  copyMissingIdsCronRule: '5/15 * * * *',
  driver: require('../driver/constantUpdates')
};

module.exports = source;
