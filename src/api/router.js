'use strict';

const Router = require('koa-router');

const db = require('./middleware/db');
const scheduler = require('./middleware/scheduler');

const router = new Router();

router.get('/db/:name/id/:id', db.getDataById);
router.get('/db/:name', db.getData);
router.get('/db/:name/info', db.getInfo);

router.get('/scheduler/all', scheduler.all);
router.get('/scheduler/trigger/:taskId', scheduler.trigger);
router.get('/scheduler/tasks', scheduler.tasks);

module.exports = router;
