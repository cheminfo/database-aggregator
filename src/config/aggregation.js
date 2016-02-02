'use strict';

'use strict';

const find= require('find');
const path = require('path');
const debug = require('../util/debug')('config:aggregation');

module.exports = {aggregation: {}};
const dbConfig = module.exports.aggregation;
const homeDir = require('./home').homeDir;
if (!homeDir) {
    return;
}

const aggregationDir = path.join(homeDir, 'aggregation');

try {

    debug.trace('Searching aggregation configurations in ' + aggregationDir);
    const databases = find.fileSync(/\.js$/, aggregationDir);
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
    debug.debug('No aggregation directory found');
}
