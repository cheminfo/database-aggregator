'use strict';

const koa = require('koa');
const router = require('./router');
const bodyParser = require('koa-body');
const kcors = require('kcors');
const config = require('../config/config');

const app = koa();
app.use(kcors());
app.use(bodyParser({
    jsonLimit: '100mb'
}));

if (config.server && config.server.middleware) {
    config.server.middleware.forEach(middleware => app.use(middleware));
}

app.use(router.routes());

module.exports = app;
