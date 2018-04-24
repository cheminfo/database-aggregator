'use strict';

const path = require('path');

const driverMethods = ['getData', 'getIds'];

function getDriver(driver) {
  if (typeof driver !== 'string' || driver === '') {
    throw new TypeError('driver is missing in config');
  }
  if (!path.isAbsolute(driver)) {
    driver = path.resolve('../driver', driver);
  }
  let driverModule;
  try {
    // eslint-disable-next-line import/no-dynamic-require
    driverModule = require(driver);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      throw new Error(`driver not found: ${driver}`);
    }
    throw e;
  }

  if (typeof driverModule !== 'object' || driverModule === null) {
    throw new TypeError('driver must be an object');
  }

  for (const method of driverMethods) {
    if (typeof driverModule[method] !== 'function') {
      throw new TypeError(`driver must provide a method named "${method}"`);
    }
  }

  return driverModule;
}

module.exports = getDriver;
