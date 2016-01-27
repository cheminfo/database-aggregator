var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
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
