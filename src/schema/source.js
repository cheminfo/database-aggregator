'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

module.exports = new Schema({
  // Unique identifier for this record.
  _id: {
    type: String,
    required: true
  },
  // Common identifier. It is either equal to _id or a less unique value that
  // will be used by the aggregator to merge lines that belong to the same
  // common object.
  commonID: {
    type: String,
    required: true,
    index: true
  },
  // Sequence ID. Used by the aggregator to know where it has to continue
  // its next synchronization.
  sequentialID: {
    type: Number,
    required: true,
    index: true
  },
  // Date of last update.
  date: {
    type: Date,
    required: true
  },
  // Raw data returned by the source database driver or null if record was
  // deleted.
  data: Object
});
