var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    seqid:  {
        type: Number,
        required: true
    },
    value: {
        type: Object,
        required: true
    }
});
