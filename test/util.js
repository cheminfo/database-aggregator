'use strict';

const path = require('path');

const mongoose = require('mongoose');

function getDriverPath(name) {
  return path.join(__dirname, 'driver', name);
}

function getCollection(name) {
  return mongoose.connection.collection(name);
}

module.exports = {
  getDriverPath,
  getCollection
};
