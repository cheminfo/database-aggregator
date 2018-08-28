'use strict';

import { getSchedulerLog } from '../model';
import { SchedulerLogEntry } from '../../types';
const Model = getSchedulerLog();

export function save(obj: SchedulerLogEntry) {
  var stat = {
    status: obj.status,
    date: new Date(),
    message: obj.message,
    stdout: obj.stdout,
    stderr: obj.stderr
  };

  return Model.findOneAndUpdate(
    { pid: obj.pid },
    {
      $push: { state: stat },
      taskId: obj.id,
      date: new Date(),
      pid: obj.pid
    },
    { upsert: true, new: true }
  ).exec();
}
