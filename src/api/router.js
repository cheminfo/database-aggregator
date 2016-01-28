'use strict';

const Router = require('koa-router');

const middleware = require('./middleware');

const router = new Router();

router.get('/db/:name', middleware.getData);

router.get('/db/:name/info', middleware.getInfo);

module.exports = router;
