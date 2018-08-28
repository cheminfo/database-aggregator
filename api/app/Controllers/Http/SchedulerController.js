'use strict';

class SchedulerController {
  all() {
    return { all: true };
  }

  trigger({ params }) {
    return { trigger: params };
  }

  tasks() {
    return { tasks: true };
  }
}

module.exports = SchedulerController;
