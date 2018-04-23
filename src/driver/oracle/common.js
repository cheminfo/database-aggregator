'use strict';

const isequal = require('lodash.isequal');

const debug = require('../../util/debug')('driver:oracle');
const model = require('../../mongo/model');
const seqid = require('../../mongo/models/seqIdCount');
const mongodb = require('../../mongo/connection');

const oracledb = require('./oracledb');

module.exports = {
  async connect(options) {
    const [connection] = await Promise.all([
      oracledb.getConnection(options),
      mongodb()
    ]);
    return connection;
  },
  checkOptions(mandatory, options) {
    mandatory.forEach((mandatory) => {
      if (!options[mandatory]) {
        throw new Error(`${mandatory} option is mandatory`);
      }
    });
  },
  async copyEntries(oracleConn, query, collection) {
    debug(query);
    const resultSet = await oracleConn.execute(query);

    debug('result set ready');

    let rows;
    do {
      rows = await resultSet.getRows(100);
      for (let i = 0; i < rows.length; i++) {
        await module.exports.copyEntry(rows[i], collection);
      }
    } while (rows.length > 0);
    await resultSet.close();
  },
  async copyEntry(row, collection) {
    const Model = model.getSource(collection);
    let doc = await Model.findById(row.ID);
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
      doc.sequentialID = await seqid.getNextSequenceID(`source_${collection}`);
      await doc.save();
    } else {
      debug.trace('rows are equal');
      if (!isequal(date, doc.date)) {
        doc.date = date;
        await doc.save();
      }
    }
  },
  async getIDs(oracleConn, query) {
    debug(query);
    const resultSet = await oracleConn.execute(query);
    debug('result set ready');

    var ids = new Set();
    let rows;
    do {
      rows = await resultSet.getRows(100);
      for (let i = 0; i < rows.length; i++) {
        ids.add(rows[i].ID.toString());
      }
    } while (rows.length > 0);
    await resultSet.close();
    return ids;
  }
};
