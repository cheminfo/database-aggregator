'use strict';

const model = use('Model');

function parseRequest({ params }) {
  const db = params.name;
  const id = params.id;
  return { db, id };
}

async function makeQuery(Model, query) {
  if (!Model) {
    return null;
  } else {
    const data = await Model.findOne(query)
      .select({ _id: 0, __v: 0 })
      .lean(true);
    return data;
  }
}

async function getSource(ctx, db, query) {
  const Model = await model.getSourceIfExists(db);
  const result = await makeQuery(Model, query);
  if (result === null) {
    ctx.response.status(404);
    return { error: 'not found' };
  } else {
    return {
      data: result
    };
  }
}

class DbController {
  async getAggregationById(ctx) {
    const { db, id } = parseRequest(ctx);
    const Model = await model.getAggregationIfExists(db);
    const result = await makeQuery(Model, { id });
    if (result === null) {
      ctx.response.status(404);
      return { error: 'not found' };
    } else {
      return {
        data: result
      };
    }
  }

  getSourceById(ctx) {
    const { db, id } = parseRequest(ctx);
    return getSource(ctx, db, { id });
  }

  getSourceByCommonId(ctx) {
    const { db, id } = parseRequest(ctx);
    return getSource(ctx, db, { commonID: id });
  }
}

module.exports = DbController;
