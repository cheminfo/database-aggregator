'use strict';

const { URL } = require('url');

const mongoose = require('mongoose');

const config = require('../config/config').globalConfig;

var _connection;
function connection() {
  if (!_connection) {
    const url = new URL(config.url);
    url.pathname = config.database;
    _connection = mongoose.connect(url.href);
  }
  return _connection;
}

connection.hasCollection = async function (colName) {
  await connection();
  let collections = await mongoose.connection.db.listCollections().toArray();
  collections = collections.map((col) => col.name);
  return collections.indexOf(colName) > -1;
};

module.exports = connection;
