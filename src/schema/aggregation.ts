import { Schema } from 'mongoose';

export default new Schema({
  // Unique identifier for this record.
  id: {
    type: String,
    required: true,
    index: 'hashed',
  },
  // Date of last update.
  date: {
    type: Number,
    required: true,
  },
  // Result of the aggregation.
  value: {
    type: Object,
    required: true,
  },
});
