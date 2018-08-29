import {
  IAggregationConfig,
  IAggregationConfigElement,
  IConfig,
  ISourceConfig,
  ISourceConfigElement
} from '../types';

export function config(configObject: IConfig) {
  const validatedConfig = Object.assign({}, configObject);
  configObject.source = sources(configObject.source);
  configObject.aggregation = aggregations(configObject.aggregation);
  return validatedConfig;
}
export function sources(sourcesConfig: ISourceConfig) {
  const validSources: ISourceConfig = {};
  for (const key of Object.keys(sourcesConfig)) {
    validSources[key] = source(sourcesConfig[key]);
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

export function aggregations(aggregationsConfig: IAggregationConfig) {
  const validAggregations: IAggregationConfig = {};
  for (const key of Object.keys(aggregationsConfig)) {
    validAggregations[key] = aggregation(aggregationsConfig[key]);
  }
  return validAggregations;
}

export function aggregation(conf: IAggregationConfigElement) {
  if (typeof conf !== 'object' || conf === null) {
    throw new TypeError('aggregation configuration must be an object');
  }
  const validatedConf = Object.assign({}, conf);

  const { collection, sources: sourcesConfig, chunkSize = 1000 } = conf;
  if (typeof collection !== 'string') {
    throw new TypeError('config.collection must be a string');
  }
  if (typeof sourcesConfig !== 'object' || sourcesConfig === null) {
    throw new TypeError('config.sources must be an object');
  }

  if (!Number.isInteger(chunkSize) || chunkSize < 1) {
    throw new TypeError('config.chunkSize must be a positive integer');
  }

  for (const sourceName in sourcesConfig) {
    if (typeof sourcesConfig[sourceName] !== 'function') {
      throw new Error(
        `all sources in the aggregation config should be functions (${sourceName})`
      );
    }
  }

  const sourceNames = Object.keys(sourcesConfig);
  if (sourceNames.length === 0) {
    throw new Error('config.sources must have at least one source');
  }

  validatedConf.chunkSize = chunkSize;
  return validatedConf;
}
