#! env node
'use strict';

require('make-promises-safe');
const { connect } = require('../src/mongo/connection');
const { start } = require('../src/scheduler');

connect(); // Connect to mongodb database
start(); // Start the scheduler

require('../api/server');
