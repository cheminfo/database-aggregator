'use strict';

const debug = require('../../util/debug')('driver:oracle');

const common = require('./common');

async function getIds(options) {
  common.checkOptions(['connectString', 'query'], options);
  const oracleConn = await common.connect(options);

  let query = options.query;
  query = `SELECT id FROM (\n${query}\n) inner_table`;
  debug(query);

  const resultSet = await oracleConn.execute(query);
  debug('result set ready');

  var ids = new Set();
  let rows;
  do {
    rows = await resultSet.getRows(100);
    for (let i = 0; i < rows.length; i++) {
      ids.add(rows[i].ID.toString());
    }
  } while (rows.length > 0);
  await resultSet.close();
  await oracleConn.release();
  return ids;
}

module.exports = getIds;
