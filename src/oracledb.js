'use strict';

const OracleDB = require('oracledb');
const Promise = require('bluebird');

exports.getConnection = function (options) {
    return new Promise(function (resolve, reject) {
        OracleDB.getConnection(options, function (err, conn) {
            return err ? reject(err) : resolve(new Connection(conn));
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
                return err ? reject(err) : resolve(new ResultSet(result.resultSet));
            });
        });
    }

    release() {
        return new Promise((resolve, reject) => {
            this._conn.release(function (err) {
                return err ? reject(err) : resolve();
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
                return err ? reject(err) : resolve();
            });
        });
    }

    getRow() {
        return new Promise((resolve, reject) => {
            this._resultSet.getRow(function (err, row) {
                return err ? reject(err) : resolve(row);
            });
        });
    }

    getRows(rows) {
        return new Promise((resolve, reject) => {
            this._resultSet.getRows(rows, function (err, rows) {
                return err ? reject(err) : resolve(rows);
            });
        });
    }
}
