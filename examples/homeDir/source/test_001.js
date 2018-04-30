'use strict';

/*
  This request returns something:

  Common ID is pid
  Unique id is id
  value1 is name of row
  value2 is description of row
*/

var sql = `
     SELECT 1111 as id, 222 as pid, 'test' as value1, 'nothing' as value2
      FROM DUAL
      WHERE 1 = 1
    `;

const credentials = require('../oracle/credentials').mydb;

const config = {
  driver: 'oracle',
  query: sql,
  mode: 'dateid',
  copyCronRule: '* * * * *', // each minute
  removeCronRule: '* * * * *'// each minute
  // ,disabled: false
};

module.exports = Object.assign(config, credentials);
