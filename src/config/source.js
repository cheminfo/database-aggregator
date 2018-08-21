'use strict';

const path = require('path');

const find = require('find');

const debug = require('../util/debug')('config:source');

module.exports = { source: {} };
const dbConfig = module.exports.source;
// eslint-disable-next-line import/no-dynamic-require
const homeDir = require('./home').homeDir;

if (!homeDir) {
  debug.debug('no home dir');
} else {
  const sourceDir = path.join(homeDir, 'source');

  try {
    const databases = find.fileSync(/\.js$/, sourceDir);
    for (const database of databases) {
      let databaseConfig;
      let configPath = path.resolve(sourceDir, database);
      let parsedConfigPath = path.parse(configPath);
      if (parsedConfigPath.ext !== '.js') {
        continue;
      }

      try {
        // eslint-disable-next-line import/no-dynamic-require
        const cfg = require(configPath);
        if (cfg.disabled) {
          continue;
        }
        databaseConfig = cfg;
      } catch (e) {
        console.error(
          'could not open source config',
          configPath,
          'with error',
          e
        );
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
