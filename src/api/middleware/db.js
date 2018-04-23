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
    d = await Model.findOne({ id: id })
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

exports.getData = async function (ctx) {
  const since = +ctx.query.since || 0;
  const limit = +ctx.query.limit || 100;
  const db = ctx.params.name;

  const Model = await model.getAggregationIfExists(db);
  var d;
  if (!Model) {
    d = [];
  } else {
    d = await Model.find({ seqid: { $gt: since } })
      .sort({ seqid: 'asc' })
      .select({ _id: 0, __v: 0 })
      .limit(limit)
      .lean(true)
      .exec();
  }

  ctx.body = {
    lastSeqId: d.length ? d[d.length - 1].seqid : 0,
    data: d
  };
};

exports.getInfo = async function (ctx) {
  const since = +ctx.query.since || 0;
  const db = ctx.params.name;

  const Model = await model.getAggregationIfExists(db);
  if (!Model) {
    ctx.body = {
      remaining: 0,
      total: 0
    };
  } else {
    ctx.body = {
      remaining: await Model.count({ seqid: { $gt: since } }),
      total: await Model.count()
    };
  }
};
