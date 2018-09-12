'use strict';

const { getTasks } = use('Src/mongo/models/schedulerLog');

class AggregationController {
  get({ params }) {
    return `Aggregation controller for ${params.name}`;
  }
  async history({ request, params }) {
    const { name } = params;
    const query = request.get();
    const result = await getTasks(`aggregation_${name}`, query);
    return result;
  }
}

module.exports = AggregationController;
