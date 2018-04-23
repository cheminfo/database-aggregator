'use strict';

const path = require('path');

const debug = require('../util/debug')('config:home');

let homeDir = process.env.DATABASE_AGGREGATOR_HOME_DIR;

if (!homeDir) {
  debug('no home dir');
  exports.config = {};
  return;
}

homeDir = path.resolve(homeDir);

debug(`home dir is ${homeDir}`);

exports.homeDir = homeDir;
exports.config = getHomeConfig();

function getHomeConfig() {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    const config = require(path.join(homeDir, 'config.js'));
    debug('loaded main config file');
    return config;
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      debug('no main config found');
    } else {
      debug.error(`Error while reading and parsing config file\n${e}`);
    }
    return {};
  }
}
