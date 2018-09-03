export interface IConfig {
  url: string;
  database: string;
  port: number;
  schedulerThreadsSource: number;
  schedulerThreadsAggregation: number;
  removeThreshold: number;
  source: ISourceConfig;
  aggregation: IAggregationConfig;
  homeDir: string;
  ssl?: {
    key: string;
    cert: string;
  };
}

export interface ISourceDriverMeta {
  latestDate: Date;
  ids?: string[];
}

export type SourceDriverCallback = (data: ISourceDriverEntry[]) => any;

export interface ISourceDriverConfig {
  getIds: (config: ISourceConfigElement) => string[] | Set<string>;
  getData: (
    config: ISourceConfigElement,
    callback: SourceDriverCallback,
    meta: ISourceDriverMeta
  ) => Promise<void>;
}

export interface ISourceConfigElement {
  collection: string;
  driver: string | ISourceDriverConfig;
  disabled?: boolean;
  version?: number;
  removeThreshold?: number;
  copyMissingIdsCronRule?: string;
  copyCronRule?: string;
  removeCronRule?: string;
  migration?: () => Promise<void>;
  [key: string]: any;
}

export type ISourceConfig = IObject<ISourceConfigElement>;

export type IAggregationConfig = IObject<IAggregationConfigElement>;

export interface IAggregationConfigElement {
  sources: {
    [key: string]: any;
  };
  collection: string;
  disabled?: boolean;
  chunkSize?: number;
  [key: string]: any;
}

export type IAggregationCallback = (
  data: ISourceEntry[],
  result: object,
  commonID: string,
  ids: string[]
) => undefined;

export interface IObject<T> {
  [key: string]: T;
}

export interface IAggregationEntry {
  id: string;
  date: number;
  value: any;
}

export interface ISourceBase {
  sequentialID: number;
  commonID: string;
}

export interface ISourceEntry extends ISourceBase {
  id: string;
  date: Date;
  data: object | null;
}

export interface ISourceDriverEntry {
  commonID: string;
  id: string;
  modificationDate: Date;
  data: object;
}

export interface ISchedulerLogEntry {
  id: string;
  pid: string;
  status: string;
  date: Date;
  message: string;
  stdout: string;
  stderr: string;
}
