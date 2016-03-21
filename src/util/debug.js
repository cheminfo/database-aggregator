'use strict';

const Debug = require('debug');

const error = Debug('aggregate:error');
const warn = Debug('aggregate:warn');
const debug = Debug('aggregate:debug');
const trace = Debug('aggregate:trace');
const step = Debug('aggregate:trace-step');

module.exports = function (prefix) {
    const func = message => debug(`(${prefix}) ${message}`);
    func.error = message => error(`(${prefix}) ${message}`);
    func.warn = message => warn(`(${prefix}) ${message}`);
    func.debug = func;
    func.trace = message => trace(`(${prefix}) ${message}`);
    func.step = message => step(`(${prefix}) ${message}`);
    return func;
};
