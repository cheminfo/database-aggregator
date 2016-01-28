'use strict';

const koa = require('koa');
const router = require('./router');
const bodyParser = require('koa-body');

const app = koa();

app.use(bodyParser({
    jsonLimit: '100mb'
}));
app.use(router.routes());

module.exports = app;
