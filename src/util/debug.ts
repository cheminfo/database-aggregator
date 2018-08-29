import * as Debug from "debug";

let error = Debug("aggregator:error");
let warn = Debug("aggregator:warn");
let debug = Debug("aggregator:debug");
let trace = Debug("aggregator:trace");

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
