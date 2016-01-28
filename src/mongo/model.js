'use strict';

const mongoose = require('mongoose');
const sourceSchema = require('../schema/source');
const aggregationSchema = require('../schema/aggregation');

const models = new Map();

exports.getSource = function (name) {
    return getModel('source', name, sourceSchema);
};

exports.getAggregation = function(name) {
    return getModel('aggregation', name, aggregationSchema);
};

function getModel(prefix, name, schema) {
    const coll_name = `${prefix}_${name}`;
    if (models.has(coll_name)) {
        return models.get(coll_name);
    }
    const model = mongoose.model(coll_name, schema, coll_name);
    models.set(coll_name, model);
    return model;
}
