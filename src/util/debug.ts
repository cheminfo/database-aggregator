'use strict';

import * as Debug from 'debug';

var error = Debug('aggregator:error');
var warn = Debug('aggregator:warn');
var debug = Debug('aggregator:debug');
var trace = Debug('aggregator:trace');

warn.log = console.warn.bind(console);
debug.log = console.log.bind(console);
trace.log = console.log.bind(console);

export function debugUtil(prefix: string) {
  return {
    error: (message: string) => error(`(${prefix}) ${message}`);
    warn: (message: string) => warn(`(${prefix}) ${message}`);
    debug: (message: string) =>debug(`(${prefix}) ${message}`);
    trace: (message: string) => trace(`(${prefix}) ${message}`);
  }
}
