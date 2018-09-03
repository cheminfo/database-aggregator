import 'make-promises-safe';
import { connect } from '../src/mongo/connection';
import { start } from '../src/scheduler';

connect(); // Connect to mongodb database
start(); // Start the scheduler

require('../api/server');
