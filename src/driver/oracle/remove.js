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

    var sourceIds = new Map();
    let rows;
    do {
        rows = yield resultSet.getRows(100);
        for(let i=0; i<rows.length; i++) {
            sourceIds.set(rows[i].ID, true);
        }
    } while (rows.length > 0);
    yield resultSet.close();
    yield oracleConn.release();

    // Element that are found in copied source but not in original source ought to be deleted
    // We do this by setting data to null, so that aggregation knows about the deletion
    const copiedIds = yield Model.find({}, {_id: 1}).lean().exec();
    for(let i=0; i<copiedIds.length; i++) {
        let id = copiedIds[i]._id;
        if(!sourceIds.get(id)) {
            debug.trace(`delete ${id} from ${collection}`);
            yield Model.findByIdAndUpdate(id, {$set: {
                data: null,
                date: new Date(),
                sequentialID: yield seqid.getNextSequenceID('source_' + collection)
            }}).exec();
        }
    }
});

function connect(options) {
    return Promise.all([oracledb.getConnection(options), mongodb()]);
}
