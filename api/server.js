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

const path = require('path');

const { Ignitor } = require('@adonisjs/ignitor');

process.env.PORT = require('../src/config/config').globalConfig.port;

new Ignitor(require('@adonisjs/fold'))
  .appRoot(path.join(__dirname))
  .fireHttpServer()
  .catch(console.error);
