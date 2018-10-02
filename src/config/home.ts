import { join, resolve } from 'path';
import { debugUtil } from '../util/debug';

const debug = debugUtil('config:home');

const homeDirVar = process.env.DATABASE_AGGREGATOR_HOME_DIR as string;
if (!homeDirVar) {
  throw new Error(
    'The DATABASE_AGGREGATOR_HOME_DIR environment variable must be set'
  );
}

export const homeDir = resolve(homeDirVar);
debug.debug(`home dir is ${homeDir}`);

// tslint:disable-next-line no-var-requires
export const config = require(join(homeDir, 'config.js'));
