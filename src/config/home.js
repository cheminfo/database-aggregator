'use strict';

const fs = require('fs');
const path = require('path');

const debug = require('../util/debug')('config:home');

const homeDir = process.env.DATABASE_AGGREGATOR_HOME_DIR;

if (!homeDir) {
    debug('no home dir');
    exports.config = {};
    return;
}

debug(`home dir is ${homeDir}`);

exports.homeDir = homeDir;
exports.config = getHomeConfig();

function getHomeConfig() {
    try {
        const config = JSON.parse(fs.readFileSync(path.resolve(homeDir, 'config.js'), 'utf8'));
        debug('loaded main config file');
        return config;
    } catch (e) {
        if (e.code === 'ENOENT') {
            debug('no main config found');
        } else {
            debug.error('Error while reading and parsing config file' + '\n' + e);
        }
        return {};
    }
}
