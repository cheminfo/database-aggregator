'use strict';

const prefix = 'DATABASE_AGGREGATOR_';

const envConfig = {};
for (const name in process.env) {
    if (name.startsWith(prefix)) {
        const realName = name.substring(prefix.length).toLowerCase().replace(/_([a-z])/g, function (value) {
            return value[1].toUpperCase();
        });
        envConfig[realName] = process.env[name];
    }
}

module.exports = envConfig;
