'use strict';
const path = require('path');
const find = require('find');

import { ISourceConfig, ISourceConfigElement } from '../types';
import { debugUtil } from '../util/debug';

const debug = debugUtil('config:source');

const dbConfig: ISourceConfig = {};
export const sourceConfig = { source: dbConfig };
// eslint-disable-next-line import/no-dynamic-require
const homeDir = require('./home').homeDir;

if (!homeDir) {
  debug.debug('no home dir');
} else {
  const sourceDir = path.join(homeDir, 'source');

  try {
    const databases = find.fileSync(/\.js$/, sourceDir);
    for (const database of databases) {
      let cfg;
      let configPath = path.resolve(sourceDir, database);
      let parsedConfigPath = path.parse(configPath);
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
      if (databaseConfig.disabled) {
        continue;
      }
      if (!databaseConfig.driver) {
        debug.warn(
          `Skipping source config ${
            parsedConfigPath.name
          } because driver is missing`
        );
        continue;
      }
      databaseConfig.collection = parsedConfigPath.name;
      dbConfig[parsedConfigPath.name] = databaseConfig;
    }
  } catch (e) {
    debug.error('there was an error reading the source config');
    debug.error(e);
    debug.error(e.stack);
  }
}
