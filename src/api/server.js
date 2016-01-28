'use strict';

const koa = require('koa');

const router = require('./router');

const app = koa();

app.use(router.routes());

module.exports = app;
