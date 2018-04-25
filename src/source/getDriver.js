'use strict';

const driverMethods = ['getData', 'getIds'];

function getDriver(driver) {
  if (typeof driver !== 'string' || driver === '') {
    throw new TypeError('driver is missing in config');
  }

  let driverLocation;
  try {
    driverLocation = require.resolve(driver);
  } catch (e) {
    throw new Error(`could not resolve driver location: ${driver}`);
  }

  // eslint-disable-next-line import/no-dynamic-require
  const driverModule = require(driverLocation);

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
