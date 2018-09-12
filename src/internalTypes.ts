import { Document } from 'mongoose';

export interface ISchedulerLogDocument extends Document {
  taskId: string;
  pid: string;
  state: ISchedulerStatus[];
  date: Date;
}

export interface ISchedulerStatus {
  status: string;
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
