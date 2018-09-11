'use strict';

const Model = use('Src/mongo/model').getSchedulerLog();

const schedule = use('Src/schedule/index');

class AggregationController {
  get({ params }) {
    return `Aggregation controller for ${params.name}`;
  }
}

module.exports = AggregationController;
