'use strict';

const koa = require('koa');
const router = require('./router');
const bodyParser = require('koa-body');
const compress = require('koa-compress');
const responseTime = require('koa-response-time');
const kcors = require('kcors');
const config = require('../config/config').globalConfig;

const app = koa();
app.use(compress());
app.use(responseTime());
app.use(kcors());
app.use(bodyParser({
    jsonLimit: '100mb'
}));

if (config.server && config.server.middleware) {
    config.server.middleware.forEach(middleware => app.use(middleware));
}

app.use(router.routes());

module.exports = app;
