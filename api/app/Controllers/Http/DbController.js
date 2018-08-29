'use strict';

const model = use('Model');

class DbController {
  async getDataById({ params, response }) {
    const db = params.name;
    const id = params.id;

    const Model = await model.getAggregationIfExists(db);
    let d;
    if (!Model) {
      d = null;
    } else {
      d = await Model.findOne({ id })
        .select({ _id: 0, __v: 0 })
        .lean(true)
        .exec();
    }

    if (d === null) {
      response.status(404);
      return {
        error: 'not found'
      };
    }

    return {
      data: d
    };
  }
}

module.exports = DbController;
