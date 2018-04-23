'use strict';
var Mongoose = require('mongoose').Mongoose;
var Mockgoose = require('mockgoose').Mockgoose;

var mongoose = new Mongoose();
var mockgoose = new Mockgoose(mongoose);

before(function () {
  return mockgoose
    .prepareStorage()
    .then(() => console.log('prepare storage done'));
});
const sources = require('../src/mongo/models/source');

const data = require('./data/data');

describe('Sources', function () {
  beforeEach(data);
  it('Should create aggregated collection', function () {
    return sources.getCommonIds('names', 0).then((ids) => {
      console.log(ids);
      return ids.should.be.an.Array;
    });
  });
});
