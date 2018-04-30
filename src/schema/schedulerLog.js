'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = new Schema({
  _id: {
    type: String,
    required: true
  },
  taskId: {
    type: String,
    required: true,
    index: true
  },
  pid: {
    type: String,
    required: true,
    index: true
  },
  state: [
    {
      status: {
        type: String,
        required: true,
        index: true
      },
      date: {
        type: Date,
        required: true,
        index: true
      },
      stdout: String,
      stderr: String,
      message: String
    }
  ],
  date: {
    type: Date,
    required: true,
    index: true
  }
});
