import { Schema } from "mongoose";

export default new Schema({
  _id: {
    type: String,
    required: true,
  },
  sourceSeq: {
    type: Object,
    default: {},
  },
});
