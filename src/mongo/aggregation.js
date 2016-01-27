'use strict';

const mongoose = require('mongoose');
const schema = require('../schema/aggregation');

exports.save = function (name, data) {
    const Model = mongoose.model(name, schema, name);
    let model = new Model(data);
    return model.save();
};
