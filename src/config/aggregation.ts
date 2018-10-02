import { join, parse, resolve } from 'path';

import * as find from 'find';

import {
  IAggregationConfig,
  IAggregationConfigElement
} from '../internalTypes';
import { debugUtil } from '../util/debug';

const debug = debugUtil('config:aggregation');

const dbConfig: IAggregationConfig = {};
export const aggregationConfig = { aggregation: dbConfig };
// tslint:disable-next-line no-var-requires
const homeDir = require('./home').homeDir;

if (homeDir) {
  const aggregationDir = join(homeDir, 'aggregation');
  let databases;
  try {
    debug.trace(`Searching aggregation configurations in ${aggregationDir}`);
    databases = find.fileSync(/\.js$/, aggregationDir);
  } catch (e) {
    debug.debug('No aggregation directory found');
  }
  databases = databases || [];

  for (const database of databases) {
    const configPath = resolve(aggregationDir, database);
    const parsedConfigPath = parse(configPath);
    if (parsedConfigPath.ext !== '.js') {
      continue;
    }

    // tslint:disable-next-line no-var-requires
    const databaseConfig: IAggregationConfigElement = require(configPath);
    if (!databaseConfig.sources) {
      continue;
    }
    databaseConfig.collection = parsedConfigPath.name;
    dbConfig[parsedConfigPath.name] = databaseConfig;
  }
}
