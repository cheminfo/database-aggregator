'use strict';

const model = require('./../model');
const debug = require('../../util/debug')('model:aggregation');
const Model = model.getSyncHistory();
exports.save = function (type, sourceName, status) {
    var model = new Model({
        type: 'source',
        name: sourceName,
        status: status,
        date: new Date()
    });

    return model.save();
};

exports.getLast = function (type, sourceName) {
    return Model.findOne({type, name: sourceName}).sort({date: 'desc'}).exec();
};