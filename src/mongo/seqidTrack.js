'use strict';

const mongoose = require('mongoose');

const schema = require('../schema/seqid');
const Model = mongoose.model('seqidTracks', schema);

exports.getLastSeqId = function (name) {
    return Model.findById(name).exec().then(result => result ? result.seq : 0);
};

exports.setSeqId = function(name, seqid) {
    return Model.findByIdAndUpdate(name, {seq: seqid}, {new: true, upsert: true})
        .exec()
        .then(result => result.seq);
};
