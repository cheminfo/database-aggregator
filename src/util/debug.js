'use strict';

const Debug = require('debug');

var error = Debug('aggregate:error');
var warn = Debug('aggregate:warn');
var debug = Debug('aggregate:debug');
var trace = Debug('aggregate:trace');

warn.log = console.warn.bind(console);
debug.log = console.log.bind(console);
trace.log = console.log.bind(console);

module.exports = function (prefix) {
    const func = message => debug(`(${prefix}) ${message}`);
    func.error = message => error(`(${prefix}) ${message}`);
    func.warn = message => warn(`(${prefix}) ${message}`);
    func.debug = func;
    func.trace = message => trace(`(${prefix}) ${message}`);
    return func;
};
