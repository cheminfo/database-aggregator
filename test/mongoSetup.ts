'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const yaml = require('js-yaml');
import mongoose from 'mongoose';

import { disconnect as mongoDisconnect } from '../src/mongo/connection';

const readFile = util.promisify(fs.readFile);

const mongoURL = 'mongodb://localhost:27017/__database-aggregator-test-db';

export async function connect() {
  await mongoose.connect(
    mongoURL,
    { useNewUrlParser: true }
  );
  await mongoose.connection.db.dropDatabase();
}

export async function disconnect() {
  await dropDatabase();
  await mongoose.connection.close();
  await mongoDisconnect();
}

export function dropDatabase() {
  return mongoose.connection.db.dropDatabase();
}

export async function insertData(filename, options = {}) {
  let parsed;
  if (typeof filename === 'string') {
    const parsedFilename = path.parse(filename);
    if (!parsedFilename.ext) {
      filename = `${filename}.yaml`;
    }
    const data = await readFile(
      path.join(__dirname, 'mongo-data', filename),
      'utf8'
    );
    parsed = yaml.safeLoad(data);
  } else if (typeof filename === 'object' && filename !== null) {
    parsed = filename;
  } else {
    throw new Error('argument must be a filename or data object');
  }
  for (const collName in parsed) {
    if (options.drop) {
      try {
        await mongoose.connection.dropCollection(collName);
      } catch (e) {
        if (e.code !== 26) throw e;
      }
    }
    const collection = mongoose.connection.collection(collName);
    await collection.insertMany(parsed[collName]);
  }
}
