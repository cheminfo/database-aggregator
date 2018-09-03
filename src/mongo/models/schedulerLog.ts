import { ISchedulerLogEntry } from '../../types';
import { getSchedulerLog } from '../model';
const Model = getSchedulerLog();

export function save(obj: ISchedulerLogEntry) {
  const stat = {
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
