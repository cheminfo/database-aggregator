'use strict';

function getDriverFunction(driver, name) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(`../driver/${driver}/${name}`);
  } catch (e) {
    throw new Error(`driver not found: ${driver}`);
  }
}

module.exports = getDriverFunction;
