'use strict';

import * as mongoose from 'mongoose';

import { globalConfig as config } from '../config/config';

const { URL } = require('url');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

export async function connect() {
  if (mongoose.connection.readyState === 0) {
    const url = new URL(config.url);
    url.pathname = config.database;
    await mongoose.connect(
      url.href,
      {
        useNewUrlParser: true
      }
    );
  }
  return mongoose.connection;
}

export async function disconnect() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}

export async function hasCollection(colName: string) {
  await connect();
  let collections = await mongoose.connection.db.listCollections().toArray();
  collections = collections.map((col) => col.name);
  return collections.indexOf(colName) > -1;
}

export async function dropCollection(colName: string) {
  await connect();
  await mongoose.connection.dropCollection(colName);
}
