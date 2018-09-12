import { IConfig } from '../internalTypes';
export let defaultConfig: IConfig = {
  url: 'mongodb://localhost:27017',
  database: 'test',
  port: 6768,
  schedulerThreadsSource: 4,
  schedulerThreadsAggregation: 4,
  removeThreshold: 0.01,
  source: {},
  aggregation: {},
  homeDir: ''
};
