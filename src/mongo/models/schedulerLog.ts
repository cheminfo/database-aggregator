import { getSchedulerLog } from '../model';
import { IChangeData } from 'process-scheduler';

const Model = getSchedulerLog();

export async function getLastStatus(taskId: string) {
  const doc = await getLastTask(taskId);
  if (!doc) {
    return doc;
  }
  return doc.state.sort((a, b) => Number(b.date) - Number(a.date))[0].status;
}

export function getLastTask(taskId: string) {
  return Model.findOne({ taskId })
    .sort('-date')
    .exec();
}

export async function save(obj: IChangeData) {
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
