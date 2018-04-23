'use strict';

const sourceSequence = require('../../mongo/models/sourceSequence');
const model = require('../../mongo/model');
const debug = require('../../util/debug')('driver:oracle');

const common = require('./common');

module.exports = function (options) {
  common.checkOptions(['connectString', 'query'], options);
  return doDelete(options);
};

async function doDelete(options) {
  const collection = options.collection;
  const Model = model.getSource(collection);

  // connect to Oracle
  const oracleConn = await common.connect(options);

  let query = options.query;

  query = `SELECT id FROM (\n${query}\n) inner_table`;

  const sourceIds = await common.getIDs(oracleConn, query);
  await oracleConn.release();

  // Element that are found in copied source but not in original source ought to be deleted
  // We do this by setting data to null, so that aggregation knows about the deletion
  const copiedIds = await Model.find({ data: { $ne: null } }, { _id: 1 })
    .lean()
    .exec();
  const idsToDelete = new Set();

  for (let i = 0; i < copiedIds.length; i++) {
    let id = copiedIds[i]._id;
    if (!sourceIds.has(id)) {
      idsToDelete.add(id);
    }
  }
  const removeThreshold =
    options.removeThreshold === undefined ? 0.01 : options.removeThreshold;
  const percentToDelete = idsToDelete.size / copiedIds.length;
  if (percentToDelete > removeThreshold) {
    debug.warn(
      `removal of data from ${collection} cancelled (maximum: ${removeThreshold *
        100}%, actual: ${percentToDelete * 100}%)`
    );
    return;
  }

  for (const id of idsToDelete) {
    debug.trace(`delete ${id} from ${collection}`);
    await Model.findByIdAndUpdate(id, {
      $set: {
        data: null,
        date: new Date(),
        sequentialID: await sourceSequence.getNextSequenceID(
          `source_${collection}`
        )
      }
    }).exec();
  }
}
