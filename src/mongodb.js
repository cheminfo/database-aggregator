'use strict';

const mongodb = require('mongodb');
const config = require('./config/config').globalConfig;
const debug = require('debug')('mongodb:driver');

var MongoClient = mongodb.MongoClient;

module.exports = function (db) {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(`${config.url}/${db}`, function(err, db) {
            if(err) {
                return reject(err);
            }
            resolve(db);
        });
    });
};
