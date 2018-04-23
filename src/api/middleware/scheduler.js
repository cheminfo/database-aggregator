'use strict';

const model = require('../../mongo/model');

const Model = model.getSchedulerLog();

var scheduler = (module.exports = {});

scheduler.all = async function () {
  const since = +this.query.since || 0;
  const limit = +this.query.limit || 50;
  try {
    this.status = 200;
    this.body = await Model.find({})
      .skip(since)
      .limit(limit)
      .lean(true)
      .exec();
  } catch (e) {
    handleError.call(this, e);
  }
};

scheduler.trigger = function () {
  process.send({
    type: 'scheduler:trigger',
    data: this.params
  });
  this.status = 200;
  this.body = 'ok';
};

scheduler.tasks = async function (next) {
  const since = +this.query.since || 0;
  const limit = +this.query.limit || 1;
  try {
    this.status = 200;
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
    this.body = results;
    await next;
  } catch (e) {
    console.log(e);
    handleError.call(this, e);
  }
};

function handleError() {
  this.status = 500;
  this.body = 'Internal server error';
}
