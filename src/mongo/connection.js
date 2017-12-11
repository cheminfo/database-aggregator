'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('../config/config').globalConfig;
var _connection;
function connection() {
    if (_connection) return _connection;

    _connection = new Promise(function (resolve, reject) {
        mongoose.connect(`${config.url}/${config.database}`, function (err) {
            if (err) return reject(err);
            resolve();
        });
    });
    return _connection;
}

connection.hasCollection = function (colName) {
    return connection().then(() => {
        return mongoose.connection.db.listCollections().toArray().then(collections => {
            collections = collections.map(col => {
                return col.name;
            });
            return collections.indexOf(colName) > -1;
        });
    });
};

module.exports = connection;
