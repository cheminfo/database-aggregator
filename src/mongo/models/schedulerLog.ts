import { ISchedulerLogEntry } from '../../types';
import { getSchedulerLog } from '../model';

const Model = getSchedulerLog();

export async function getLastStatus(taskId: string) {
  const doc = await getLastTask(taskId);
  if (!doc) {
    return doc;
  }
  return doc.state[doc.state.length - 1].status;
}

export function getLastTask(taskId: string) {
  return Model.findOne({ taskId })
    .sort('-date')
    .exec();
}

export async function save(obj: ISchedulerLogEntry) {
  const stat = {
    status: obj.status,
    date: new Date(),
    message: obj.message,
    stdout: obj.stdout,
    stderr: obj.stderr
  };

  function update() {
    return Model.findOneAndUpdate(
      { pid: obj.pid },
      {
        $push: { state: stat },
        taskId: obj.id,
        date: new Date(),
        pid: obj.pid
      },
      {
        upsert: true,
        new: true
      }
    ).exec();
  }

  while (true) {
    try {
      return await update();
    } catch (e) {
      // This error can happen if two upserts with the same pid are done very
      // quickly
      if (e.codeName !== 'DuplicateKey') {
        throw e;
      }
    }
  }
}
