'use strict';

const Promise = require('bluebird');
const oracledb = require('../oracledb');
const mongodb = require('../mongo/connection');
const model = require('../mongo/model');
const seqid = require('../mongo/seqid');
const sqlUtil = require('../util/sql');

module.exports = function (options) {
    if (!options.connectString) {
        throw new Error('connectString option is mandatory');
    }
    if (!options.query) {
        throw new Error('query option is mandatory');
    }
    if (!options.mode) {
        throw new Error('mode option is mandatory');
    }

    switch (options.mode) {
        case 'dateid':
            return dateid(options);
        default:
            throw new Error(`invalid mode: ${options.mode}`);
    }
};

function dateid(options) {
    if (!options.dateClause) {
        throw new Error('dateClause option is mandatory');
    }
    return doDateid(options);
}

const doDateid = Promise.coroutine(function* (options) {
    const collection = options.collection;
    const Model = model.getSource(collection);

    // connect to Oracle and Mongo
    const connections = yield connect(options);
    const oracleConn = connections[0];

    // search for latest document in Mongo
    const latest = yield Model.findOne().sort('-date').exec();
    let query = options.query;

    if (latest) {
        // >= because many rows can have the same date
        query = `${query}\n${options.dateClause} ${options.dateField} >= ${sqlUtil.formatTimestamp(latest.date)}`;
    }

    // This clause is very important for incremental updates
    query = `${query}\nORDER BY ${options.dateField} ASC`;

    console.log(query);

    const resultSet = yield oracleConn.execute(query);
    let rows;
    do {
        rows = yield resultSet.getRows(100);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            let doc = yield Model.findById(row.ID);
            if (!doc) {
                doc = new Model();
                doc._id = row.ID;
                doc.commonID = row.PID;
            }
            doc.date = row.MODDATE;
            delete row.ID;
            delete row.PID;
            delete row.MODDATE;
            doc.data = row;
            doc.sequentialID = yield seqid.getNextSequenceID('entry_' + collection);
            yield doc.save();
        }
    } while (rows.length > 0);
    yield resultSet.close();
    yield oracleConn.release();
});

function connect(options) {
    return Promise.all([oracledb.getConnection(options), mongodb()]);
}
