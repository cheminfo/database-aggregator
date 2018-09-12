'use strict';

const Model = use('Src/mongo/model').getSchedulerLog();
const schedule = use('Src/schedule/index');

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
    const result = await Model.find({ taskId: `source_copy_${name}` })
      .sort({
        date: -1
      })
      .select({ _id: 0, __v: 0, 'state._id': 0 });
    return result;
  }
}

module.exports = SourceController;
