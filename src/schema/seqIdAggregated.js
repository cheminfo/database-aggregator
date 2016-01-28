'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    seq: {
        type: Object,
        default: {}
    }
});
