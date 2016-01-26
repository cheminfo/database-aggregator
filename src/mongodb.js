'use strict';

const mongodb = require('mongodb');
const config = require('./config/config');

var MongoClient = mongodb.MongoClient;

exports = function (db) {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(`${config.url}/${db}`, function(err, db) {
            if(err) {
                return reject(err);
            }
            console.log("Connected correctly to server");
            resolve(db);
        });
    })
};
