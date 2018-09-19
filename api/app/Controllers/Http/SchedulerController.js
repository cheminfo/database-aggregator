'use strict';

const schedule = use('Src/schedule/index');

class SchedulerController {
  async tasks() {
    const tasks = await schedule.getTasks();
    return tasks;
  }
}

module.exports = SchedulerController;
