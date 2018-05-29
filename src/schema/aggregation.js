'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

module.exports = new Schema({
  // Unique identifier for this record.
  id: {
    type: String,
    required: true,
    index: 'hashed'
  },
  // Date of last update.
  date: {
    type: Number,
    required: true
  },
  // Result of the aggregation.
  value: {
    type: Object,
    required: true
  }
});
