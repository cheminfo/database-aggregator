import { IChangeData } from 'process-scheduler';
import { getSchedulerLog } from '../model';

const Model = getSchedulerLog();

export async function getLastState(taskId: string) {
  const doc = await getLastTask(taskId, {
    'state._id': 0,
    'state.stdout': 0,
    'state.stderr': 0
  });
  if (!doc) {
    return doc;
  }
  const state = doc.state.sort((a, b) => Number(b.date) - Number(a.date))[0];

  return state;
}

export async function updateOutstandingTasks() {
  return Model.updateMany(
    {
      state: {
        $not: {
          $elemMatch: { status: { $in: ['success', 'error', 'interrupted'] } }
        }
      }
    },
    {
      $push: {
        state: {
          status: 'interrupted',
          date: new Date()
        }
      }
    }
  ).exec();
}

export function getLastTask(taskId: string, select?: any) {
  return Model.findOne({ taskId })
    .sort('-date')
    .select(select)
    .exec();
}

export async function getTasks(taskId: string | string[], options: any) {
  const dateParams: any = {};
  if (options.from) {
    dateParams.$gt = new Date(+options.from);
  }
  if (options.to) {
    dateParams.$lt = new Date(+options.to);
  }

  const filter: any = {};

  if (Array.isArray(taskId)) {
    filter.taskId = {
      $in: taskId
    };
  } else {
    filter.taskId = taskId;
  }
  if (options.from && options.to) {
    filter.date = dateParams;
  }
  const result = await Model.find(filter)
    .sort({
      date: -1
    })
    .select({ _id: 0, __v: 0, 'state._id': 0 });
  return result;
}

export async function save(obj: IChangeData) {
  const stat = {
    status: obj.status,
    date: new Date(),
    reason: obj.reason,
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
