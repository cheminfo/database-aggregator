'use strict';

'use strict';

const fs = require('fs');
const path = require('path');


module.exports = {source: {}};
const dbConfig = module.exports.source;
const homeDir = require('./home').config.homeDir;

if (!homeDir) {
    return;
}

const sourceDir = `${homeDir}/source`;

try {
    const databases = fs.readdirSync(sourceDir);
    for (const database of databases) {
        let databaseConfig;
        let configPath = path.resolve(sourceDir, database);
        let parsedConfigPath = path.parse(configPath);
        if (parsedConfigPath.ext !== '.js') {
            continue;
        }

        try {
            databaseConfig = require(configPath);
        } catch (e) {
            // database config is not mandatory
            continue;
        }
        if (!databaseConfig.driver) {
            continue;
        }
        dbConfig[parsedConfigPath.name] = databaseConfig;


    }
} catch (e) {
    console.error(e);
}