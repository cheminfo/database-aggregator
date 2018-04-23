'use strict';

const mongoose = require('mongoose');

const config = require('../config/config').globalConfig;

var _connection;
function connection() {
  if (!_connection) {
    _connection = mongoose.connect(`${config.url}/${config.database}`);
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
