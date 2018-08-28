export interface IConfig {
  url: string;
  database: string;
  port: number;
  schedulerThreadsSource: number;
  schedulerThreadsAggregation: number;
  removeThreshold: number;
  sources: ISourceConfig;
  aggregation: IAggregationConfig;
}

export interface ISourceConfigElement {
  collection?: string;
  driver: any;
  disabled?: boolean;
  version?: number;
}

export type ISourceConfig = IObject<ISourceConfigElement>;

export type IAggregationConfig = IObject<IAggregationConfigElement>;

export interface IAggregationConfigElement {
  sources: {
    [key: string]: any;
  };
  collection?: string;
  disabled?: boolean;
  chunkSize: number;
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
  id: String;
  date: Date;
  data: object | null;
}

export interface SchedulerLogEntry {
  id: string;
  pid: string;
  status: string;
  date: Date;
  message: string;
  stdout: string;
  stderr: string;
}
