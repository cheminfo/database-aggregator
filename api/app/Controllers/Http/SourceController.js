'use strict';

const Model = use('Src/mongo/model').getSchedulerLog();

class SourceController {
  get({ params }) {
    return `Source controller for ${params.name}`;
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
