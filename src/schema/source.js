var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
    commonID:  {
        type: String,
        required: true
    },
    sequentialID: {
        type: Number,
        required: true
    },
    data: Object
});
