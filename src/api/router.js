'use strict';

const Router = require('koa-router');

const db = require('./middleware/db');
const scheduler = require('./middleware/scheduler');

const router = new Router();

router.get('/db/:name', db.getData);
router.get('/db/:name/info', db.getInfo);
router.get('/scheduler/all', scheduler.all);

module.exports = router;
