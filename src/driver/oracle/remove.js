'use strict';

const Promise = require('bluebird');
const isequal = require('lodash.isequal');
const oracledb = require('../../oracledb');
const mongodb = require('../../mongo/connection');
const seqid = require('../../mongo/models/seqIdCount');
const model = require('../../mongo/model');
const debug = require('../../util/debug')('driver:oracle');

module.exports = function (options) {
    if (!options.connectString) {
        throw new Error('connectString option is mandatory');
    }
    if (!options.query) {
        throw new Error('query option is mandatory');
    }

    return doDelete(options);
};


const doDelete = Promise.coroutine(function* (options) {
    const collection = options.collection;
    const Model = model.getSource(collection);

    // connect to Oracle
    const connections = yield connect(options);
    const oracleConn = connections[0];

    let query = options.query;

    query = 'SELECT id FROM (\n' + query + '\n) inner_table';

    debug(query);

    const resultSet = yield oracleConn.execute(query);

    debug('result set ready');

    let rows;
    let allRows = [];
    do {
        rows = yield resultSet.getRows(1000);
        allRows = allRows.concat(rows.map(row => row.ID));
    } while (rows.length > 0);
    yield resultSet.close();
    yield oracleConn.release();

    // Element that are found in copied source but not in original source ought to be deleted
    // We do this by setting data to null, so that aggregation knows about the deletion
    const deleted = yield Model.find({_id: { $nin: rows}, data: {$ne: null}}).exec();
    for(let i=0; i<deleted.length; i++) {
        let del = deleted[i];
        debug.trace(`delete ${del._id} from ${collection}`);
        del.data = null;
        del.date = new Date();
        del.sequentialID = yield seqid.getNextSequenceID('source_' + collection);
        yield del.save();
    }
});

function connect(options) {
    return Promise.all([oracledb.getConnection(options), mongodb()]);
}
