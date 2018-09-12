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
    const query = request.get();
    const dateParams = {};
    if (query.from) dateParams.$gt = new Date(+query.from);
    if (query.to) dateParams.$lt = new Date(+query.to);
    const { name } = params;

    const filter = {
      taskId: `source_copy_${name}`
    };
    if (query.from && query.to) {
      filter.date = dateParams;
    }
    const result = await Model.find(filter)
      .sort({
        date: -1
      })
      .select({ _id: 0, __v: 0, 'state._id': 0 });
    return result;
  }
}

module.exports = SourceController;
