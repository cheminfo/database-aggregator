'use strict';

const path = require('path');

const mongoose = require('mongoose');

function getDriverPath(name) {
  return path.join(__dirname, 'driver', name);
}

function getCollection(name) {
  return mongoose.connection.collection(name);
}

function clean(data) {
  if (Array.isArray(data)) {
    data.forEach((item) => {
      delete item._id;
    });
  } else {
    delete data._id;
  }
  return data;
}

module.exports = {
  getDriverPath,
  getCollection,
  clean
};
