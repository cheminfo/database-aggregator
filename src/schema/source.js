'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    _id: {
        type: String,
        required: true
    },
    commonID: {
        type: String,
        required: true,
        index: true
    },
    sequentialID: {
        type: Number,
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true
    },
    data: Object
});
