'use strict';

import {
  IConfig,
  ISourceConfig,
  ISourceConfigElement,
  IAggregationConfig,
  IAggregationConfigElement
} from '../types';

export function config(config: IConfig) {
  let validatedConfig = Object.assign({}, config);
  config.sources = sources(config.sources);
  config.aggregation = aggregations(config.aggregation);
  return validatedConfig;
}
export function sources(sources: ISourceConfig) {
  const validSources: ISourceConfig = {};
  for (let key of Object.keys(sources)) {
    validSources[key] = source(sources[key]);
  }
  return validSources;
}

export function source(conf: ISourceConfigElement) {
  const configVersion = conf.version;
  if (configVersion !== undefined && typeof configVersion !== 'number') {
    throw new Error('source version must be a number');
  }
  return Object.assign({}, conf);
}

export function aggregations(aggregations: IAggregationConfig) {
  const validAggregations: IAggregationConfig = {};
  for (let key of Object.keys(aggregations)) {
    validAggregations[key] = aggregation(aggregations[key]);
  }
  return validAggregations;
}

export function aggregation(conf: IAggregationConfigElement) {
  if (typeof conf !== 'object' || conf === null) {
    throw new TypeError('aggregation configuration must be an object');
  }
  const validatedConf = Object.assign({}, conf);

  const { collection, sources, chunkSize = 1000 } = conf;
  if (typeof collection !== 'string') {
    throw new TypeError('config.collection must be a string');
  }
  if (typeof sources !== 'object' || sources === null) {
    throw new TypeError('config.sources must be an object');
  }

  if (!Number.isInteger(chunkSize) || chunkSize < 1) {
    throw new TypeError('config.chunkSize must be a positive integer');
  }

  for (let source in sources) {
    if (typeof sources[source] !== 'function') {
      throw new Error(
        `all sources in the aggregation config should be functions (${source})`
      );
    }
  }

  const sourceNames = Object.keys(sources);
  if (sourceNames.length === 0) {
    throw new Error('config.sources must have at least one source');
  }

  validatedConf.chunkSize = chunkSize;
  return validatedConf;
}
