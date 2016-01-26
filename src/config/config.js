'use strict';

const debug = require('debug')('config');

const defaultConfig = require('./default');
const homeConfig = require('./home').config;
const envConfig = require('./env');

exports.getConfig = function (customConfig) {
    return Object.assign({}, defaultConfig, homeConfig, envConfig, customConfig);
};



exports.globalConfig = exports.getConfig();
