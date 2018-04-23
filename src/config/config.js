'use strict';

const debug = require('../util/debug')('config');

const defaultConfig = require('./default');
const homeConfig = require('./home').config;
const envConfig = require('./env');
const aggregationConfig = require('./aggregation');
const sourceConfig = require('./source');

exports.getConfig = function (customConfig) {
  debug.trace('get config');
  return Object.assign({}, defaultConfig, homeConfig, aggregationConfig, sourceConfig, envConfig, customConfig);
};

exports.globalConfig = exports.getConfig();
