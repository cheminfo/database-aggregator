import 'make-promises-safe';
import { connect, startScheduler } from '../src/index';

connect(); // Connect to mongodb database
startScheduler(); // Start the scheduler

require('../../api/server');
