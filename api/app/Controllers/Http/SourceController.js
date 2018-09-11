'use strict';

const Model = use('Src/mongo/model').getSchedulerLog();

const schedule = use('Src/schedule/index');

class SourceController {
  get({ params }) {
    return `Source controller for ${params.name}`;
  }
}

module.exports = SourceController;
