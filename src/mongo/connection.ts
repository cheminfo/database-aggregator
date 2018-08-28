'use strict';

const { URL } = require('url');

import { connection, connect as connectMongoose } from 'mongoose';

import { globalConfig as config } from '../config/config';

export async function connect() {
  if (connection.readyState === 0) {
    const url = new URL(config.url);
    url.pathname = config.database;
    await connectMongoose(url.href, { useNewUrlParser: true });
  }
  return connection;
}

export async function disconnect() {
  if (connection.readyState !== 0) {
    await connection.close();
  }
}

export async function hasCollection(colName: string) {
  await connect();
  let collections = await connection.db.listCollections().toArray();
  collections = collections.map(col => col.name);
  return collections.indexOf(colName) > -1;
}

export async function dropCollection(colName: string) {
  await connect();
  await connection.dropCollection(colName);
}
