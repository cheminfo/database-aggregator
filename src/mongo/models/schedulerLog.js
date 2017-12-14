'use strict';

const model = require('./../model');
const Model = model.getSchedulerLog();

exports.save = function (obj) {
    var stat = {
        status: obj.status,
        date: new Date(),
        message: obj.message,
        stdout: obj.stdout,
        stderr: obj.stderr
    };

    return Model.findOneAndUpdate({pid: obj.pid}, {
        $push: {state: stat},
        taskId: obj.id,
        date: new Date(),
        pid: obj.pid
    }, {upsert: true, new: true}).exec();
};

