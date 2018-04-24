'use strict';

const sqlUtil = require('../../util/sql');
const debug = require('../../util/debug')('oracle:getSourceData');

const common = require('./common');

async function getSourceData(options, callback, latestDate, before, ids) {
  const oracleConn = await common.connect(options);

  const query = options.query;

  let dataQuery = `
    SELECT * FROM (
      ${query}
    ) inner_table
    WHERE 1=1
  `;
  if (latestDate) {
    if (before) {
      dataQuery += `\nAND moddate < ${sqlUtil.formatTimestamp(latestDate)}`;
    } else {
      dataQuery += `\nAND moddate >= ${sqlUtil.formatTimestamp(latestDate)}`;
    }
  }
  if (ids) {
    dataQuery += `\nAND ID IN ('${ids.join("','")}')`;
  }

  // This clause is very important for incremental updates
  dataQuery += '\nORDER BY moddate ASC';

  debug(dataQuery);
  const resultSet = await oracleConn.execute(query);
  debug('result set ready');

  let rows;
  do {
    const entries = [];
    rows = await resultSet.getRows(100);
    for (let i = 0; i < rows.length; i++) {
      entries.push(convert(rows[i]));
    }
    await callback(entries);
  } while (rows.length > 0);

  await oracleConn.release();
}

function convert(row) {
  const obj = {
    id: row.ID,
    commonID: row.PID,
    modificationDate: row.MODDATE || new Date(0),
    data: row
  };

  delete row.ID;
  delete row.PID;
  delete row.MODDATE;
  return obj;
}

module.exports = getSourceData;
