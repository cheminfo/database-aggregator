'use strict';

const getDriverFunction = require('./getDriverFunction');

function copy(options) {
  const driverCopy = getDriverFunction(options.driver, 'copy');
  return driverCopy;
}

module.exports = copy;
