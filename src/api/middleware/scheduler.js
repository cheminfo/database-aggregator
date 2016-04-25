'use strict';

const model = require('../../mongo/model');
const Model = model.getSchedulerLog();

var scheduler = module.exports = {};

scheduler.all = function * () {
    try {
        this.status = 200;
        this.body = yield Model.find({}).lean(true).exec();
    } catch(e) {
        handleError.call(this, e);
    }
};

function handleError(e) {
    this.status = 500;
    this.body = 'Internal server error';
}