#! env node

import { globalConfig as config } from '../src/config/config';
import { connect } from '../src/mongo/connection';
require('make-promises-safe');
const app = require('../src/api/server');
import { debugUtil } from '../src/util/debug';

const debug = debugUtil('bin:server');
const { start } = require('../src/scheduler');

connect(); // Connect to mongodb database
start(); // Start the scheduler

if (config.ssl) {
  require('https')
    .createServer(config.ssl, app.callback())
    .listen(config.port, () => {
      debug.warn(`running on https://localhost:${config.port}`);
    });
} else {
  require('http')
    .createServer(app.callback())
    .listen(config.port, () => {
      debug.warn(`running on http://localhost:${config.port}`);
    });
}
