'use strict';

const model = require('./../model');
const debug = require('../../util/debug')('model:source');

exports.getCommonIds = function (name, fromSeq) {
    debug.trace(`getCommonIds for source ${name} from seq ${fromSeq}`);
    fromSeq = fromSeq || 0;
    var Model = model.getSource(name);
    return Model
        .find({sequentialID: {$gt: fromSeq}})
        .select({commonID: 1, sequentialID: 1})
        .sort({_id: 'asc'})
        .exec();
};

exports.getLastSeqId = function (name) {
    const Model = model.getSource(name);
    return Model.findOne({}).sort({sequentialID: 'desc'});
};

exports.getByCommonId = function (name, commonId) {
    debug.trace(`get source ${name}, commonID: ${commonId}`);
    var Model = model.getSource(name);
    return Model.find({commonID: commonId}).exec();
};
