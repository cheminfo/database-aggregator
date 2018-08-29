import { Schema } from "mongoose";

export default new Schema({
  // Unique identifier for this record.
  id: {
    type: String,
    required: true,
    index: "hashed",
  },
  // Common identifier. It is either equal to id or a less unique value that
  // will be used by the aggregator to merge lines that belong to the same
  // common object.
  commonID: {
    type: String,
    required: true,
    index: "hashed",
  },
  // Sequence ID. Used by the aggregator to know where it has to continue
  // its next synchronization.
  sequentialID: {
    type: Number,
    required: true,
    index: true,
  },
  // Date of last update.
  date: {
    type: Date,
    required: true,
  },
  // Raw data returned by the source database driver or null if record was
  // deleted.
  data: Object,
});
