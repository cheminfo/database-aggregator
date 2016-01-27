'use strict';

const mongoose = require('mongoose');
const config = require('../config/config').globalConfig;
var _connection;
module.exports = function () {
    if(_connection) return _connection;

    _connection = new Promise(function(resolve, reject) {
        mongoose.connect(`${config.url}/${config.database}`, function (err) {
            if(err) return reject(err);
            resolve();
        });
    });
    return _connection;
};
