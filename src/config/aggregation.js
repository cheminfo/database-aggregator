'use strict';

const path = require('path');

const find = require('find');

const debug = require('../util/debug')('config:aggregation');

module.exports = { aggregation: {} };
const dbConfig = module.exports.aggregation;
// eslint-disable-next-line import/no-dynamic-require
const homeDir = require('./home').homeDir;

if (homeDir) {
  const aggregationDir = path.join(homeDir, 'aggregation');
  var databases;
  try {
    debug.trace(`Searching aggregation configurations in ${aggregationDir}`);
    databases = find.fileSync(/\.js$/, aggregationDir);
  } catch (e) {
    debug.debug('No aggregation directory found');
  }
  databases = databases || [];

  for (const database of databases) {
    let databaseConfig;
    let configPath = path.resolve(aggregationDir, database);
    let parsedConfigPath = path.parse(configPath);
    if (parsedConfigPath.ext !== '.js') {
      continue;
    }

    // eslint-disable-next-line import/no-dynamic-require
    databaseConfig = require(configPath);
    if (!databaseConfig.sources || databaseConfig.disabled === true) {
      continue;
    }
    databaseConfig.name = parsedConfigPath.name;
    dbConfig[parsedConfigPath.name] = databaseConfig;
  }
}
