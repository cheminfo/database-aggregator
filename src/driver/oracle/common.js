'use strict';

const oracledb = require('./oracledb');

function connect(config) {
  return oracledb.getConnection(config);
}

function checkOptions(mandatory, config) {
  mandatory.forEach((mandatory) => {
    if (!config[mandatory]) {
      throw new Error(`${mandatory} option is mandatory`);
    }
  });
}

module.exports = {
  connect,
  checkOptions
};
