'use strict';

const http = require('http');
const app = require('../src/api/server');
const config = require('../src/config/config').globalConfig;
const debug = require('../src/util/debug')('bin:server');
const connection = require('../src/mongo/connection');

connection();

http.createServer(app.callback()).listen(config.port, function () {
    debug.warn('running on localhost:' + config.port);
});