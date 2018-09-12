'use strict';

const Model = use('Src/mongo/model').getSchedulerLog();
const schedule = use('Src/schedule/index');
const { getTasks } = use('Src/mongo/models/schedulerLog');

class SourceController {
  async get({ params, response }) {
    const source = await schedule.getSource(params.name);
    if (!source) {
      response.status(404);
      return { error: 'source not found' };
    }
    return source;
  }

  async history({ request, params }) {
    const { name } = params;
    const query = request.get();
    const result = await getTasks(
      [
        `source_copy_${name}`,
        `source_remove_${name}`,
        `source_copy_missing_ids_${name}`
      ],
      query
    );
    return result;
  }
}

module.exports = SourceController;
