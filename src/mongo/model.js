'use strict';

const mongoose = require('mongoose');
const sourceSchema = require('../schema/source');
const aggregationSchema = require('../schema/aggregation');
const seqIdCountSchema = require('../schema/seqIdCount');
const seqIdAggregatedSchema = require('../schema/seqIdAggregated');
const schedulerLogSchema = require('../schema/schedulerLog');
const connection = require('../mongo/connection');

const models = new Map();

exports.getSource = function (name) {
    return getModel('source', name, sourceSchema);
};

exports.getAggregation = function(name) {
    return getModel('aggregation', name, aggregationSchema);
};

exports.getAggregationIfExists = function (name) {
    return getModelIfExists('aggregation', name, aggregationSchema);
};

exports.getSeqIdCount = function () {
    return getModel('_', 'seqIdCount', seqIdCountSchema);
};

exports.getSeqIdAggregated = function () {
    return getModel('_', 'seqIdAggregated', seqIdAggregatedSchema);
};

exports.getSchedulerLog = function () {
    return getModel('_', 'schedulerLog', schedulerLogSchema);
};


function getModel(prefix, name, schema) {
    const collName = `${prefix}_${name}`;
    if (models.has(collName)) {
        return models.get(collName);
    }
    const model = mongoose.model(collName, schema, collName);
    models.set(collName, model);
    return model;
}

function getModelIfExists(prefix, name, schema) {
    return Promise.resolve().then(() => {
        const collName = `${prefix}_${name}`;
        if (models.has(collName)) {
            return models.get(collName);
        } else {
            return connection.hasCollection(collName).then(hasCol => {
                if(!hasCol) return;
                const model = mongoose.model(collName, schema, collName);
                models.set(collName, model);
                return model;
            })
        }
    });
}