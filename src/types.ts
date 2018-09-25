export interface IConfigFile {
  url: string;
  database: string;
  port: number;
  schedulerThreadsSource: number;
  schedulerThreadsAggregation: number;
  removeThreshold: number;
  ssl?: {
    key: string;
    cert: string;
  };
}

export interface ISourceConfigFile<DriverConfigType = any> {
  driver: string | ISourceDriverConfig<DriverConfigType>;
  driverConfig: DriverConfigType;
  disabled?: boolean;
  version?: number;
  removeThreshold?: number;
  copyMissingIdsCronRule?: string;
  copyCronRule?: string;
  removeCronRule?: string;
  migration?: () => Promise<void>;
}

export interface ISourceDriverConfig<DriverConfig = any> {
  getIds: (config: DriverConfig) => string[] | Set<string>;
  getData: (
    config: DriverConfig,
    callback: SourceDriverCallback,
    meta: ISourceDriverMeta
  ) => void | Promise<void>;
}

export type SourceDriverCallback = (
  data: ISourceDriverEntry[]
) => void | Promise<void>;

export interface ISourceDriverMeta {
  latestDate: Date | null;
  ids?: string[];
}

export interface ISourceDriverEntry {
  commonID: string;
  id: string;
  modificationDate: Date;
  data: object;
}

export interface IAggregationConfigFile<AggregationResultType = any> {
  sources: {
    [key: string]: IAggregationCallback<any, AggregationResultType>;
  };
  disabled?: boolean;
  chunkSize?: number;
}

export type IAggregationCallback<
  SourceDataType extends object = any,
  AggregationResult = any
> = (
  data: SourceDataType[],
  result: AggregationResult,
  commonID: string,
  ids: string[]
) => void;
