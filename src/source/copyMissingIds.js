'use strict';

const getDriverFunction = require('./getDriverFunction');

function copyMissingIds(options) {
  const driverCopyMissingIds = getDriverFunction(
    options.driver,
    'copyMissingIds'
  );
  return driverCopyMissingIds;
}

module.exports = copyMissingIds;
