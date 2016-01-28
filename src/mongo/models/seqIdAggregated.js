'use strict';

const model = require('./../model');
const Model = model.getSeqIdAggregated();

exports.getLastSeqId = function (name) {
    return Model.findById(name).exec().then(result => result ? result.seq : 0);
};

exports.setSeqId = function(name, seqid) {
    return Model.findByIdAndUpdate(name, {seq: seqid}, {new: true, upsert: true})
        .exec()
        .then(result => result.seq);
};
