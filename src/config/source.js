'use strict';

const find = require('find');
const path = require('path');

module.exports = {source: {}};
const dbConfig = module.exports.source;
const homeDir = require('./home').homeDir;

if (!homeDir) {
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
            if (!cfg.disabled) {
                databaseConfig = cfg;
            }
        } catch (e) {
            // database config is not mandatory
            continue;
        }
        if (!databaseConfig.driver) {
            continue;
        }
        dbConfig[parsedConfigPath.name] = databaseConfig;


    }
} catch (e) {}
