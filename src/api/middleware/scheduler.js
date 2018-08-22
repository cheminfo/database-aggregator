'use strict';

const { triggerTask } = require('../../scheduler');
const model = require('../../mongo/model');

const Model = model.getSchedulerLog();

var scheduler = module.exports;

scheduler.all = async function (ctx) {
  const since = +ctx.query.since || 0;
  const limit = +ctx.query.limit || 50;
  try {
    ctx.status = 200;
    ctx.body = await Model.find({})
      .skip(since)
      .limit(limit)
      .lean(true)
      .exec();
  } catch (e) {
    handleError.call(ctx, e);
  }
};

scheduler.trigger = async function (ctx) {
  try {
    triggerTask(ctx.params.taskId);
  } catch (e) {
    ctx.status = 500;
    ctx.body = e.message;
  }
};

scheduler.tasks = async function (ctx, next) {
  const since = +ctx.query.since || 0;
  const limit = +ctx.query.limit || 1;
  try {
    ctx.status = 200;
    var results = [];
    let tasksList = await Model.find().distinct('taskId');
    for (var i = 0; i < tasksList.length; i++) {
      let history = await Model.find({
        taskId: tasksList[i]
      })
        .sort({
          date: -1
        })
        .skip(since)
        .limit(limit)
        .lean(true)
        .exec();
      results.push({
        taskId: tasksList[i],
        history: history
      });
    }
    ctx.body = results;
    await next();
  } catch (e) {
    console.log(e);
    handleError(ctx, e);
  }
};

function handleError(ctx) {
  ctx.status = 500;
  ctx.body = 'Internal server error';
}
