'use strict';

const isequal = require('lodash.isequal');
const debug = require('debug');
const model = require('../../mongo/model');
const seqid = require('../../mongo/models/seqIdCount');
const oracledb = require('../../oracledb');
const mongodb = require('../../mongo/connection');
const Promise = require('bluebird');

module.exports = {
    connect: function (options) {
        return Promise.all([oracledb.getConnection(options), mongodb()])
            .then(connections => connections[0]);
    },
    checkOptions: function (mandatory, options) {
        mandatory.forEach(mandatory => {
            if (!options[mandatory]) {
                throw new Error(`${mandatory} option is mandatory`);
            }
        });
    },
    copyEntries: Promise.coroutine(function * (oracleConn, query, collection) {
        debug(query);
        const resultSet = yield oracleConn.execute(query);

        debug('result set ready');

        let rows;
        do {
            rows = yield resultSet.getRows(100);
            for (let i = 0; i < rows.length; i++) {
                yield module.exports.copyEntry(rows[i], collection);
            }
        } while (rows.length > 0);
        yield resultSet.close();

    }),
    copyEntry: Promise.coroutine(function * (row, collection) {
        const Model = model.getSource(collection);
        let doc = yield Model.findById(row.ID);
        if (!doc) {
            doc = new Model();
            doc._id = row.ID;
            doc.commonID = row.PID;
        }

        const date = row.MODDATE || new Date(0);

        delete row.ID;
        delete row.PID;
        delete row.MODDATE;

        if (!isequal(doc.data, row)) {
            debug.trace('rows are not equal');
            doc.data = row;
            doc.date = date;
            doc.sequentialID = yield seqid.getNextSequenceID('source_' + collection);
            yield doc.save();
        } else {
            debug.trace('rows are equal');
            if (!isequal(date, doc.date)) {
                doc.date = date;
                yield doc.save();
            }
        }
    }),
    getIDs: Promise.coroutine(function * (oracleConn, query) {
        debug(query);
        const resultSet = yield oracleConn.execute(query);
        debug('result set ready');

        var ids = new Set();
        let rows;
        do {
            rows = yield resultSet.getRows(100);
            for (let i = 0; i < rows.length; i++) {
                ids.add(rows[i].ID.toString());
            }
        } while (rows.length > 0);
        yield resultSet.close();
        return ids;
    })
}
;
