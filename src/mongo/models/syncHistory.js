'use strict';

const model = require('./../model');
const debug = require('../../util/debug')('model:aggregation');
const Model = model.getSyncHistory();
exports.save = function (type, operation, name, status) {
    var model = new Model({
        type,
        name,
        status,
        operation,
        date: new Date()
    });

    return model.save();
};

exports.getLast = function (type, operation, name) {
    return Model.findOne({type, operation, name}).sort({date: 'desc'}).exec();
};