'use strict';

const model = require('./../model');
const debug = require('../../util/debug')('model:schedulerLog');
const Model = model.getSchedulerLog();

exports.save = function (obj) {

    var stat = {
        status: obj.status,
        date: new Date(),
        message: obj.message,
        stdout: obj.stdout,
        stderr: obj.stderr
    };

    return Model.findOneAndUpdate({pid: obj.id}, {
        $push: {state: stat},
        taskId: obj.id,
        date: new Date(),
        pid: obj.pid
    }, {upsert: true, new: true}).exec();
};

