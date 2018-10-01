import { Schema } from 'mongoose';

export default new Schema({
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
    index: true,
    unique: true
  },
  state: [
    {
      status: {
        type: String,
        required: true,
        index: true
      },
      reason: {
        type: String,
        required: false,
        index: false
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
