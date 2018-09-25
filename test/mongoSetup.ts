import { readFile } from 'fs';
import { parse, join } from 'path';
import { promisify } from 'util';

const yaml = require('js-yaml');
import { connect as mongooseConnect, connection } from 'mongoose';

import { disconnect as mongoDisconnect } from '../src/mongo/connection';

const readFileAsync = promisify(readFile);

const mongoURL = 'mongodb://localhost:27017/__database-aggregator-test-db';

export async function connect() {
  await mongooseConnect(mongoURL, {
    useNewUrlParser: true
  });
  await connection.db.dropDatabase();
}

export async function disconnect() {
  await dropDatabase();
  await connection.close();
  await mongoDisconnect();
}

export function dropDatabase() {
  return connection.db.dropDatabase();
}

export async function insertData(
  filename: string | object,
  options: IInsertDataOptions = {}
) {
  let parsed;
  if (typeof filename === 'string') {
    const parsedFilename = parse(filename);
    if (!parsedFilename.ext) {
      filename = `${filename}.yaml`;
    }
    const data = await readFileAsync(
      join(__dirname, 'mongo-data', filename),
      'utf8'
    );
    parsed = yaml.safeLoad(data);
  } else if (typeof filename === 'object' && filename !== null) {
    parsed = filename;
  } else {
    throw new Error('argument must be a filename or data object');
  }
  for (const collName of Object.keys(parsed)) {
    if (options.drop) {
      try {
        await connection.dropCollection(collName);
      } catch (e) {
        if (e.code !== 26) {
          throw e;
        }
      }
    }
    const collection = connection.collection(collName);
    await collection.insertMany(parsed[collName]);
  }
}

interface IInsertDataOptions {
  drop?: boolean;
}
