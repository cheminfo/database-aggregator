import { debugUtil } from '../util/debug';

const path = require('path');
const debug = debugUtil('config:home');

// eslint-disable-next-line no-process-env
export let config = {};
export let homeDir = process.env.DATABASE_AGGREGATOR_HOME_DIR;
if (!homeDir) {
  debug.debug('no home dir');
  exports.config = {};
} else {
  homeDir = path.resolve(homeDir);
  debug.debug(`home dir is ${homeDir}`);
  config = getHomeConfig();
}

function getHomeConfig() {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    const homeConfig = require(path.join(homeDir, 'config.js'));
    debug.debug('loaded main config file');
    return homeConfig;
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      debug.debug('no main config found');
    } else {
      debug.error(`Error while reading and parsing config file\n${e}`);
    }
    return {};
  }
}
