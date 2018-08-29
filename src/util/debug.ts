import * as Debug from 'debug';

const error = Debug('aggregator:error');
const warn = Debug('aggregator:warn');
const debug = Debug('aggregator:debug');
const trace = Debug('aggregator:trace');

warn.log = console.warn.bind(console);
debug.log = console.log.bind(console);
trace.log = console.log.bind(console);

export function debugUtil(prefix: string) {
  return {
    error: (message: string) => error(`(${prefix}) ${message}`),
    warn: (message: string) => warn(`(${prefix}) ${message}`),
    debug: (message: string) => debug(`(${prefix}) ${message}`),
    trace: (message: string) => trace(`(${prefix}) ${message}`),
  };
}
