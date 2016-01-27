'use strict';

'use strict';

const fs = require('fs');
const path = require('path');


module.exports = {aggregation: {}};
const dbConfig = module.exports.aggregation;
const homeDir = require('./home').config.homeDir;
console.log(homeDir)
if (!homeDir) {
    return;
}

const aggregationDir = `${homeDir}/aggregation`;

try {
    const databases = fs.readdirSync(aggregationDir);
    for (const database of databases) {
        let databaseConfig;
        let configPath = path.resolve(aggregationDir, database);
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
        if (!databaseConfig.sources) {
            continue;
        }
        dbConfig[parsedConfigPath.name] = databaseConfig;


    }
} catch (e) {
    console.error(e);
}