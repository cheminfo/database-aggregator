'use strict';

const Model = use('Src/mongo/model').getSchedulerLog();

class SchedulerController {
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
    return { trigger: params };
  }

  tasks() {
    return { tasks: true };
  }
}

module.exports = SchedulerController;
