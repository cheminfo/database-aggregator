'use strict';

const Router = require('koa-router');

const db = require('./middleware/db');
const scheduler = require('./middleware/scheduler');

const router = new Router();

router.get('/db/:name', db.getData);
router.get('/db/:name/info', db.getInfo);
router.get('/scheduler/all', scheduler.all);
router.get('/scheduler/tasks', scheduler.tasks);
router.get('/scheduler/task/history', scheduler.taskHistory);

module.exports = router;
