'use strict';

const app = require('../src/api/server');
const config = require('../src/config/config').globalConfig;
const debug = require('../src/util/debug')('bin:server');
const connection = require('../src/mongo/connection');

connection();

if (config.ssl) {
    require('https').createServer(config.ssl, app.callback()).listen(config.port, function () {
        debug.warn('running on https://localhost:' + config.port);
    });
} else {
    require('http').createServer(app.callback()).listen(config.port, function () {
        debug.warn('running on http://localhost:' + config.port);
    });
}
