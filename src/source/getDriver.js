'use strict';

const path = require('path');

function getDriver(driver) {
  if (!path.isAbsolute(driver)) {
    driver = path.join('../driver', driver);
  }
  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(driver);
  } catch (e) {
    throw new Error(`driver not found: ${driver}`);
  }
}

module.exports = getDriver;
