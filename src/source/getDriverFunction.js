'use strict';

const path = require('path');

function getDriverFunction(driver, name) {
  if (!path.isAbsolute(driver)) {
    driver = path.join('../driver', driver);
  }
  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(path.join(driver, name));
  } catch (e) {
    throw new Error(`driver not found: ${driver}`);
  }
}

module.exports = getDriverFunction;
