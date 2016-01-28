'use strict';

const connection = require('./../connection');
const model = require('./../model');

exports.getCommonIds = function (name, fromSeq) {
    return connection().then(() => {
        fromSeq = fromSeq || 0;
        var Model = model.getSource(name);
        return Model
            .find({sequentialID: {$gt: fromSeq}})
            .select({commonID: 1, sequentialID: 1})
            .sort({sequentialID: 'asc'})
            .exec();
    });
};

exports.getByCommonId = function (name, commonId) {
    var Model = model.getSource(name);
    return Model.find({commonID: commonId}).exec();
};
