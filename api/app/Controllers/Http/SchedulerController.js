'use strict';

const Model = use('Src/mongo/model').getSchedulerLog();
const { triggerTask } = use('Src/scheduler');

const schedule = use('Src/schedule/index');

class SchedulerController {
  async tasks() {
    const tasks = await schedule.getTasks();
    return tasks;
  }

  all({ request }) {
    const query = request.get();
    const since = +query.since || 0;
    const limit = +query.limit || 50;
    return Model.find({})
      .skip(since)
      .limit(limit)
      .lean(true)
      .exec();
  }

  trigger({ params }) {
    triggerTask(params.taskId);
    return { ok: true };
  }

  // async tasks({ request }) {
  //   const query = request.get();
  //   const since = query.since || 0;
  //   const limit = query.limit || 1;
  //   const results = [];
  //   const tasksList = await Model.find().distinct('taskId');
  //   for (const taskId of tasksList) {
  //     const history = await Model.find({ taskId })
  //       .sort({
  //         date: -1
  //       })
  //       .skip(since)
  //       .limit(limit)
  //       .lean(true)
  //       .exec();
  //     results.push({
  //       taskId,
  //       history
  //     });
  //   }
  //   return results;
  // }
}

module.exports = SchedulerController;
