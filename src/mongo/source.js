'use strict';

const mongoose = require('mongoose');
const schema = require('../schema/source');
const connection = require('./connection');

exports.getCommonIds = function (name, fromSeq) {
    return connection().then(() => {
        fromSeq = fromSeq || 0;
        var Model = mongoose.model(name, schema, name);
        return Model.find({sequentialID: {$gt: fromSeq}}).select({commonID: 1}).exec().then(res => res.map(r => r.commonID));
    });
};

exports.getByCommonId = function (name, commonId) {
    var Model = mongoose.model(name, schema, name);
    return Model.find({commonID: commonId}).exec();
};
