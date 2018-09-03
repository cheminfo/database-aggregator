/* tslint:disable no-console */

import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

const isRunning = require('is-running');

const pidFile = join(__dirname, '../../source.pid');

export function start() {
  try {
    const pid = readFileSync(pidFile, 'utf8');
    if (isRunning(pid)) {
      console.log(`process is running (pid: ${pid})`);
      process.exit(0);
    }
    console.log('pid file is here but process died');
    unlinkSync(pidFile);
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log('pid file does not exist yet');
    } else {
      throw e;
    }
  }
  const currentPid = process.pid;
  writeFileSync(pidFile, String(currentPid));
}

export function stop(code?: number) {
  code = code || 0;
  unlinkSync(pidFile);
  process.exit(code);
}
