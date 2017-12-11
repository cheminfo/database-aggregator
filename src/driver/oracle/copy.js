'use strict';

const Promise = require('bluebird');
const model = require('../../mongo/model');
const sqlUtil = require('../../util/sql');
const common = require('./common');

module.exports = function (options) {
    common.checkOptions(['connectString', 'query', 'mode'], options);

    switch (options.mode) {
        case 'dateid':
            return dateid(options);
        default:
            throw new Error(`invalid mode: ${options.mode}`);
    }
};

function dateid(options) {
    return doDateid(options);
}

const doDateid = Promise.coroutine(function* (options) {
    const collection = options.collection;
    const Model = model.getSource(collection);

    // connect to Oracle and Mongo
    const oracleConn = yield common.connect(options);

    // search for latest document in Mongo
    const latest = yield Model.findOne().sort('-date').exec();
    let query = options.query;

    query = 'SELECT * FROM (\n' + query + '\n) inner_table';

    if (latest) {
        // >= because many rows can have the same date
        query = `${query}\nWHERE moddate >= ${sqlUtil.formatTimestamp(latest.date)}`;
    }

    // This clause is very important for incremental updates
    query = `${query}\nORDER BY moddate ASC`;


    yield common.copyEntries(oracleConn, query, collection);
    yield oracleConn.release();
});

