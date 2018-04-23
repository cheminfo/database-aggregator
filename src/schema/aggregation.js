'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

module.exports = new Schema({
  // Unique identifier for this record.
  _id: {
    type: String,
    required: true
  },
  value: {
    type: Object,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  id: {
    type: String,
    required: true
  }
});
