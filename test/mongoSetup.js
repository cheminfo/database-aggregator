'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const yaml = require('js-yaml');
const mongoose = require('mongoose');

const { disconnect: mongoDisconnect } = require('../src/mongo/connection');

const readFile = util.promisify(fs.readFile);

const mongoURL = 'mongodb://localhost/__database-aggregator-test-db';

async function connect() {
  await mongoose.connect(mongoURL);
  await mongoose.connection.db.dropDatabase();
}

async function disconnect() {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
  await mongoDisconnect();
}

async function insertData(filename) {
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
    const collection = mongoose.connection.collection(collName);
    await collection.insertMany(parsed[collName]);
  }
}

module.exports = {
  connect,
  disconnect,
  insertData
};
