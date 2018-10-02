import { Document } from 'mongoose';
import {
  IAggregationConfigFile,
  IConfigFile,
  ISourceConfigFile
} from './types';

export interface IObject<T> {
  [key: string]: T;
}

export interface IConfig extends IConfigFile {
  source: ISourceConfig;
  aggregation: IAggregationConfig;
  homeDir: string;
}

export interface ISourceConfigElement extends ISourceConfigFile {
  collection: string;
}

export type ISourceConfig = IObject<ISourceConfigElement>;

export interface IAggregationConfigElement extends IAggregationConfigFile {
  collection: string;
}

export type IAggregationConfig = IObject<IAggregationConfigElement>;

export interface ISchedulerLogDocument extends Document {
  taskId: string;
  pid: string;
  state: ISchedulerStatus[];
  date: Date;
}

export interface ISchedulerStatus {
  status: string;
  reason?: string;
  date: Date;
  stdout?: string;
  stderr?: string;
  message?: string;
}

export interface ISourceDocument<T extends object = object> extends Document {
  id: string;
  commonID: string;
  sequentialID: number;
  date: Date;
  data: T;
}

export interface IAggregationDocument<T = any> extends Document {
  id: string;
  date: Date;
  value: T;
}

export interface ISourceSequenceDocument extends Document {
  _id: string;
  seq: number;
  version: number;
}

export interface IAggregationSequenceDocument extends Document {
  _id: string;
  sourceSeq: {
    [key: string]: number;
  };
}

export interface IScheduleDefinition {
  id: string;
  worker: string;
  immediate: boolean;
  cronRule?: string;
  deps: string[];
  noConcurrency: string[];
  arg: string;
  type: string;
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
