'use strict';

const schedule = use('Src/schedule/index');
const { getTasks } = use('Src/mongo/models/schedulerLog');
const { triggerTask } = use('Src/scheduler');

class AggregationController {
  async get({ params, response }) {
    const aggregation = await schedule.getAggregation(params.name);
    if (!aggregation) {
      response.status(404);
      return { error: 'aggregation not found' };
    }
    return aggregation;
  }
  async history({ request, params }) {
    const { name } = params;
    const query = request.get();
    const result = await getTasks(`aggregation_${name}`, query);
    return result;
  }
  trigger({ params }) {
    triggerTask(`aggregation_${params.name}`);
    return { ok: true };
  }
}

module.exports = AggregationController;
