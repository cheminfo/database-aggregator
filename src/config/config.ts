import { defaultConfig } from './default';
import { config as homeConfig } from './home';
import { envConfig } from './env';
import { aggregationConfig } from './aggregation';
import { IConfig } from '../types';
import { sourceConfig } from './source';
import { debugUtil } from '../util/debug';

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
