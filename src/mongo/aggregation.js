'use strict';

const model = require('./model');

exports.save = function (name, data) {
    const Model = model.getAggregation(name);
    let m = new Model(data);
    return m.save();
};
