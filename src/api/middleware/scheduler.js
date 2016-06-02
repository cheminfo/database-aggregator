'use strict';

const model = require('../../mongo/model');
const Model = model.getSchedulerLog();

var scheduler = module.exports = {};

scheduler.all = function*() {
    const since = +this.query.since || 0;
    const limit = +this.query.limit || 50;
    try {
        this.status = 200;
        this.body = yield Model.find({})
            .skip(since)
            .limit(limit)
            .lean(true)
            .exec();
    } catch (e) {
        handleError.call(this, e);
    }
};


scheduler.tasks = function*() {
    const since = +this.query.since || 0;
    const limit = +this.query.limit || 50;

    try {
        this.status = 200;
        this.body = yield Model.aggregate()
            .sort({
                taskId: -1,
                date: 1
            })
            .group({
                _id: "$taskId",
                count: {
                    $sum: 1
                },
                lastest: {
                    $last: "$$ROOT"
                }
            })
            .skip(since)
            .limit(limit)
            .allowDiskUse(true)
            .exec();
    } catch (e) {
        console.log(e)
        handleError.call(this, e);
    }
};

scheduler.taskHistory = function*() {
    const since = +this.query.since || 0;
    const limit = +this.query.limit || 5;
    const taskId = this.query.taskId || "";

    try {
        this.status = 200;
        this.body = yield Model.aggregate()
            .match({
                taskId: taskId
            })
            .sort({
                date: 1
            })
            .skip(since)
            .limit(limit)
            .allowDiskUse(true)
            .exec();
    } catch (e) {
        console.log(e)
        handleError.call(this, e);
    }
};

function handleError(e) {
    this.status = 500;
    this.body = 'Internal server error';
}