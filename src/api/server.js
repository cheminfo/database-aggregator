'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const responseTime = require('koa-response-time');
const kcors = require('kcors');

const config = require('../config/config').globalConfig;

const router = require('./router');

const app = new Koa();
app.use(compress());
app.use(responseTime());
app.use(
  kcors(
    Object.assign(
      {},
      { credentials: true },
      config.server ? config.server.cors : null
    )
  )
);
app.use(
  bodyParser({
    jsonLimit: '100mb'
  })
);

if (config.server && config.server.middleware) {
  config.server.middleware.forEach((middleware) => app.use(middleware));
}

app.use(router.routes());

module.exports = app;
