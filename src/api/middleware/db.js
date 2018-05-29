'use strict';

const model = require('../../mongo/model');

exports.getDataById = async function (ctx) {
  const db = ctx.params.name;
  const id = ctx.params.id;

  const Model = await model.getAggregationIfExists(db);
  var d;
  if (!Model) {
    d = null;
  } else {
    d = await Model.findOne({ id })
      .select({ _id: 0, __v: 0 })
      .lean(true)
      .exec();
  }

  if (d === null) {
    ctx.status = 404;
  }

  ctx.body = {
    data: d
  };
};
