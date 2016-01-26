var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    commonID:  String,
    sequentialID: Number,
    data:  Object
});
