'use strict';

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstrap Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass relative path from the project root.
*/

require('make-promises-safe');

const path = require('path');

const { Ignitor } = require('@adonisjs/ignitor');

const config = require('../lib/src/config/config').globalConfig;
const { startScheduler } = require('../lib/src/index');

startScheduler(); // Start the scheduler

process.env.HOST = '0.0.0.0';
process.env.PORT = config.port;

function httpServerCallback(server) {
  let instance;
  if (config.ssl) {
    instance = require('https').createServer(config.ssl, server);
  } else {
    instance = require('http').createServer(server);
  }
  return instance;
}

new Ignitor(require('@adonisjs/fold'))
  .appRoot(path.join(__dirname))
  .fireHttpServer(httpServerCallback)
  .catch(console.error);
