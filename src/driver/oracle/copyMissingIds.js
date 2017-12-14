'use strict';

const Promise = require('bluebird');
const debug = require('../../util/debug')('driver:oracle');
const model = require('../../mongo/model');
const sqlUtil = require('../../util/sql');
const common = require('./common');
const chunk = require('lodash.chunk');

const MAX_ELEMENTS_ID_CLAUSE = 999;

// In a similar fashion to how remove works, finds all the ids
// that are present in the source but missing in the target
// and copies those to the target

module.exports = function (options) {
    common.checkOptions(['connectString', 'query'], options);
    return doSync(options);
};


const doSync = Promise.coroutine(function* (options) {
    const collection = options.collection;
    const Model = model.getSource(collection);

    // connect to Oracle
    const oracleConn = yield common.connect(options);

    const query = options.query;
    const idQuery = 'SELECT id FROM (\n' + query + '\n) inner_table';

    const latest = yield Model.findOne().sort('-date').exec();


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


    debug(`adding ${idsToCopy.size} missing entries`);
    const chunks = chunk([...idsToCopy], MAX_ELEMENTS_ID_CLAUSE);
    for (let chunk of chunks) {
        let copyQuery = `
            SELECT * FROM (
                ${query}
            ) inner_table
            WHERE moddate < ${sqlUtil.formatTimestamp(latest.date)}
            AND ID IN ('${chunk.join("','")}')
        `;
        yield common.copyEntries(oracleConn, copyQuery, collection);
    }

    yield oracleConn.release();
});
