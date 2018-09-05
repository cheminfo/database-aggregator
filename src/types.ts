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

export interface ISourceConfigFile {
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

export interface ISourceConfigElement extends ISourceConfigFile {
  collection: string;
}

export type ISourceConfig = IObject<ISourceConfigElement>;

export type IAggregationConfig = IObject<IAggregationConfigElement>;

export interface IAggregationConfigFile<
  SourceDataType = any,
  AggregationResult = any
> {
  sources: {
    [key: string]: IAggregationCallback<SourceDataType, AggregationResult>;
  };
  disabled?: boolean;
  chunkSize?: number;
  [key: string]: any;
}
export interface IAggregationConfigElement extends IAggregationConfigFile {
  collection: string;
}

export type IAggregationCallback<
  SourceDataType = any,
  AggregationResult = any
> = (
  data: SourceDataType[],
  result: AggregationResult,
  commonID: string,
  ids: string[]
) => void;

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
