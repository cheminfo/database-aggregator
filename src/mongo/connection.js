'use strict';

const { URL } = require('url');

const mongoose = require('mongoose');

const config = require('../config/config').globalConfig;

async function connect() {
  if (mongoose.connection.readyState === 0) {
    const url = new URL(config.url);
    url.pathname = config.database;
    await mongoose.connect(url.href);
  }
  return mongoose.connection;
}

async function disconnect() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}

async function hasCollection(colName) {
  await connect();
  let collections = await mongoose.connection.db.listCollections().toArray();
  collections = collections.map((col) => col.name);
  return collections.indexOf(colName) > -1;
}

async function dropCollection(colName) {
  await connect();
  await mongoose.connection.dropCollection(colName);
}

module.exports = {
  connect,
  disconnect,
  hasCollection,
  dropCollection
};
