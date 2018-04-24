'use strict';

var Mongoose = require('mongoose').Mongoose;
var Mockgoose = require('mockgoose').Mockgoose;

var mongoose = new Mongoose();
var mockgoose = new Mockgoose(mongoose);

module.exports = {
  prepare: function () {
    return mockgoose.prepareStorage().then(() => {
      return mockgoose.helper.reset();
    });
  }
};
