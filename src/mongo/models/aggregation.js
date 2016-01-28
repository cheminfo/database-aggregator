'use strict';

const model = require('./../model');

exports.save = function (name, data) {
    let m = new Model(data);
    return m.save();
};

exports.findAll = function(name) {
    const Model = model.getAggregation(name);
    return Model.find({});
};

exports.getLatestSeqId = function(name) {
    const Model = model.getAggregation(name);
    return Model.findOne({}).sort({seqid: 'desc'}).exec();
};

exports.countFromSeqId = function(name, fromSeqId) {
    const Model = model.getAggregation(name);
    return Model.count({seqid: {$gt: fromSeqId}});
};

exports.count = function(name) {
    const Model = model.getAggregation(name);
    return Model.count();
};