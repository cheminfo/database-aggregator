'use strict';

const schedule = use('Src/schedule/index');
const { getTasks } = use('Src/mongo/models/schedulerLog');
const { triggerTask } = use('Src/scheduler');

const types = ['copy', 'remove', 'copy_missing_ids'];

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
    const taskOptions = {
      from: +query.from,
      to: +query.to
    };
    const result = await getTasks(
      [
        `source_copy_${name}`,
        `source_remove_${name}`,
        `source_copy_missing_ids_${name}`
      ],
      taskOptions
    );
    return result;
  }

  trigger({ request, response, params }) {
    const query = request.get();
    const type = query.type;
    if (!type || !types.includes(type)) {
      response.status(400);
      return {
        ok: false,
        error: 'invalid or missing type'
      };
    }
    triggerTask(`source_${type}_${params.name}`);
    return { ok: true };
  }
}

module.exports = SourceController;
