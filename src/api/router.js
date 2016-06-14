'use strict';

const Router = require('koa-router');
const jsonBody = require('koa-json-body');

const db = require('./middleware/db');
const scheduler = require('./middleware/scheduler');

const router = new Router();

router.get('/db/:name', db.getData);
router.get('/db/:name/info', db.getInfo);
router.post('/db/:name/update', jsonBody(), db.updateData);

router.get('/scheduler/all', scheduler.all);
router.get('/scheduler/trigger/:taskId', scheduler.trigger);
router.get('/scheduler/tasks', scheduler.tasks);


module.exports = router;
