'use strict';

const Promise = require('bluebird');
const model = require('../../mongo/model');
const common = require('./common');

// In a similar fashion to how remove works, finds all the ids
// that are present in the source but missing in the target
// and copies those to the target

module.exports = function (options) {
    common.checkOptions(['connectString', 'idQuery', 'copyQuery'], options);
    return doSync(options);
};


const doSync = Promise.coroutine(function* (options) {
    const collection = options.collection;
    const Model = model.getSource(collection);

    // connect to Oracle
    const oracleConn = yield common.connect(options);

    let idQuery = options.query;
    idQuery = 'SELECT id FROM (\n' + idQuery + '\n) inner_table';
    let copyQuery = options.copyQuery;
    copyQuery = 'SELECT * FROM (\n' + copyQuery + '\n) inner_table';


    // Get all ids from original source
    const sourceIds = yield common.getIDs(oracleConn, idQuery);

    // Get all ids from copied source
    const targetIds = new Set(
        (yield Model.find({data: {$ne: null}}, {_id: 1}).lean().exec())
            .map(t => t._id)
    );
    const idsToCopy = new Set();

    for (let id of sourceIds) {
        // add to list if exists in original source but not in copied source
        if (!targetIds.has(id)) {
            idsToCopy.add(id);
        }
    }

    copyQuery = `${copyQuery}\nWHERE ID in {${[...idsToCopy].join(',')}}`;
    yield common.copyEntries(oracleConn, copyQuery, collection);
    yield oracleConn.release();
});
