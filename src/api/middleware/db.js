'use strict';

const model = require('../../mongo/model');
const seqid = require('../../mongo/models/seqIdCount');

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

exports.updateData = async function (ctx) {
  if (!ctx.request.body || typeof ctx.request.body !== 'object') {
    error(ctx, 'body is not an object');
    return;
  }
  const body = ctx.request.body;
  const docID = body.id;
  const date = body.date;
  const value = body.value;
  if (!docID || !date || !value) {
    error(ctx, 'missing ID, date or value');
    return;
  }

  const db = ctx.params.name;
  const Model = await model.getAggregationIfExists(db);
  if (!Model) {
    error(ctx, `unknown database: ${db}`);
    return;
  }

  const doc = await Model.findById(docID);
  if (doc === null) {
    let newDoc = new Model({
      _id: docID,
      seqid: await seqid.getNextSequenceID(`aggregation_${db}`),
      value,
      date,
      action: 'update',
      id: docID
    });
    await newDoc.save();
    ctx.body = { success: true, seqid: newDoc.seqid };
  } else if (doc.seqid === body.seqid) {
    doc.value = body.value;
    doc.date = body.date;
    doc.seqid = await seqid.getNextSequenceID(`aggregation_${db}`);
    await doc.save();
    ctx.body = { success: true, seqid: doc.seqid };
  } else {
    ctx.status = 409;
    ctx.body = { error: true, reason: 'conflict' };
  }
};

function error(ctx, reason) {
  ctx.status = 400;
  ctx.body = { error: true, reason };
}
