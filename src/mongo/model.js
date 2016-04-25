'use strict';

const mongoose = require('mongoose');
const sourceSchema = require('../schema/source');
const aggregationSchema = require('../schema/aggregation');
const seqIdCountSchema = require('../schema/seqIdCount');
const seqIdAggregatedSchema = require('../schema/seqIdAggregated');
const syncHistorySchema = require('../schema/syncHistory');
const schedulerLogSchema = require('../schema/schedulerLog');

const models = new Map();

exports.getSource = function (name) {
    return getModel('source', name, sourceSchema);
};

exports.getAggregation = function(name) {
    return getModel('aggregation', name, aggregationSchema);
};

exports.getSeqIdCount = function () {
    return getModel('_', 'seqIdCount', seqIdCountSchema);
};

exports.getSeqIdAggregated = function () {
    return getModel('_', 'seqIdAggregated', seqIdAggregatedSchema);
};

exports.getSyncHistory = function () {
    return getModel('_', 'syncHistory', syncHistorySchema);
};

exports.getSchedulerLog = function () {
    return getModel('_', 'schedulerLog', schedulerLogSchema);
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
