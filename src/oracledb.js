'use strict';

const OracleDB = require('oracledb');
const Promise = require('bluebird');

exports.getConnection = function (options) {
    return new Promise(function (resolve, reject) {
        OracleDB.getConnection(options, function (err, conn) {
            if (err) return reject(err);
            resolve(new Connection(conn));
        });
    });
};

class Connection {
    constructor(conn) {
        this._conn = conn;
    }

    execute(query) {
        return new Promise((resolve, reject) => {
            this._conn.execute(query, {}, {
                outFormat: OracleDB.OBJECT,
                resultSet: true
            }, function (err, result) {
                if (err) return reject(err);
                resolve(new ResultSet(result.resultSet));
            });
        });
    }

    release() {
        return new Promise((resolve, reject) => {
            this._conn.release(function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }
}

class ResultSet {
    constructor(resultSet) {
        this._resultSet = resultSet;
    }

    close() {
        return new Promise((resolve, reject) => {
            this._resultSet.close(function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    getRow() {
        return new Promise((resolve, reject) => {
            this._resultSet.getRow(function (err, row) {
                if (err) return reject(err);
                resolve(row);
            });
        });
    }

    getRows(rows) {
        return new Promise((resolve, reject) => {
            this._resultSet.getRows(rows, function (err, rows) {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
}
