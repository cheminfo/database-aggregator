'use strict';

const find = require('find');
const path = require('path');
const debug = require('../util/debug')('config:source');
module.exports = {source: {}};
const dbConfig = module.exports.source;
const homeDir = require('./home').homeDir;

if (!homeDir) {
    debug.debug(`no home dir`);
    return;
}

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
            const cfg = require(configPath);
            if (cfg.disabled) {
                continue;
            }
            databaseConfig = cfg;
        } catch (e) {
            console.error('could not open source config', configPath)
            continue;
        }
        if (!databaseConfig.driver) {
            continue;
        }
        dbConfig[parsedConfigPath.name] = databaseConfig;


    }
} catch (e) {}
