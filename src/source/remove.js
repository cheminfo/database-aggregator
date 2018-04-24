'use strict';

const getDriverFunction = require('./getDriverFunction');

function remove(options) {
  const driverRemove = getDriverFunction(options.driver, 'remove');
  return driverRemove;
}

module.exports = remove;
