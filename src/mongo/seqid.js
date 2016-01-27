'use strict';

const mongoose = require('mongoose');

const schema = require('../schema/seqid');
const Model = mongoose.model('seqid', schema);

exports.getNextSequenceID = function (name) {
    return Model.findByIdAndUpdate(name, {$inc: {seq: 1}}, {new: true, upsert: true})
        .exec()
        .then(result => result.seq);
};
