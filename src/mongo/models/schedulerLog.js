'use strict';

const model = require('./../model');
const debug = require('../../util/debug')('model:schedulerLog');
const Model = model.getSchedulerLog();

exports.saveStatus = function (obj) {
    var model = new Model({
        stdout: obj.stdout,
        stderr: obj.stderr,
        pid: obj.pid,
        message: obj.message,
        status: obj.status,
        taskId: obj.id,
        date: new Date()
    });

    return model.save();
};
