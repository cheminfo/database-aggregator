'use strict';

const oracledb = require('./oracledb');

function connect(options) {
  return oracledb.getConnection(options);
}

function checkOptions(mandatory, options) {
  mandatory.forEach((mandatory) => {
    if (!options[mandatory]) {
      throw new Error(`${mandatory} option is mandatory`);
    }
  });
}

module.exports = {
  connect,
  checkOptions
};
