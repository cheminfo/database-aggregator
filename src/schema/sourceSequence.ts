import { Schema } from 'mongoose';
export default new Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
  version: {
    type: Number,
    default: 0,
  },
});
