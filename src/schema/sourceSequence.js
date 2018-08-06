'use strict';

const { Schema } = require('mongoose');

module.exports = new Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  },
  version: {
    type: Number,
    default: 0
  }
});
