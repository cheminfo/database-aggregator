'use strict';
import { join, resolve, parse } from 'path';
const find = require('find');

import { ISourceConfig, ISourceConfigElement } from '../internalTypes';
import { debugUtil } from '../util/debug';

import { homeDir } from './home';
import { validateDriver } from '../util/validateDriver';

const debug = debugUtil('config:source');

const dbConfig: ISourceConfig = {};
export const sourceConfig = { source: dbConfig };
// eslint-disable-next-line import/no-dynamic-require

if (!homeDir) {
  debug.debug('no home dir');
} else {
  const sourceDir = join(homeDir, 'source');

  const databases = find.fileSync(/\.js$/, sourceDir);
  for (const database of databases) {
    let cfg;
    const configPath = resolve(sourceDir, database);
    const parsedConfigPath = parse(configPath);
    if (parsedConfigPath.ext !== '.js') {
      continue;
    }

    try {
      // eslint-disable-next-line import/no-dynamic-require
      cfg = require(configPath);
    } catch (e) {
      console.error(
        'could not open source config',
        configPath,
        'with error',
        e
      );
      continue;
    }
    const databaseConfig: ISourceConfigElement = cfg;

    if (!databaseConfig.driver) {
      debug.warn(
        `Skipping source config ${
          parsedConfigPath.name
        } because driver is missing`
      );
      continue;
    }
    if (typeof databaseConfig.driver === 'object') {
      validateDriver(databaseConfig.driver);
    }
    databaseConfig.collection = parsedConfigPath.name;
    dbConfig[parsedConfigPath.name] = databaseConfig;
  }
}
