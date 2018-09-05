import { IConfig } from '../types';
import { debugUtil } from '../util/debug';
import { aggregationConfig } from './aggregation';
import { defaultConfig } from './default';
import { envConfig } from './env';
import { config as homeConfig } from './home';
import { sourceConfig } from './source';

const debug = debugUtil('config');

export function getConfig(customConfig?: any): IConfig {
  debug.trace('get config');
  return Object.assign(
    {},
    defaultConfig,
    homeConfig,
    aggregationConfig,
    sourceConfig,
    envConfig,
    customConfig
  );
}

export const globalConfig = getConfig();
