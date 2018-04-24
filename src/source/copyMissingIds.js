'use strict';

const chunk = require('lodash.chunk');

const model = require('../mongo/model');
const mongodbConnect = require('../mongo/connection');
const debug = require('../util/debug')('source:copyMissingIds');

const getDriverFunction = require('./getDriverFunction');
const copyEntries = require('./copyEntries');

const MAX_ELEMENTS_ID_CLAUSE = 999;

// In a similar fashion to how remove works, finds all the ids
// that are present in the source but missing in the target
// and copies those to the target
async function copyMissingIds(options) {
  const driverGetIds = getDriverFunction(options.driver, 'getIds');
  const driverGetSourceData = getDriverFunction(
    options.driver,
    'getSourceData'
  );

  let sourceIds = await driverGetIds(options);
  if (!(sourceIds instanceof Set)) {
    sourceIds = new Set(sourceIds);
  }

  const collection = options.collection;
  const Model = model.getSource(collection);

  await mongodbConnect();

  // Get all ids from copied source
  const targetIds = new Set(
    (await Model.find({ data: { $ne: null } }, { _id: 1 })
      .lean()
      .exec()).map((t) => t._id)
  );
  const idsToCopy = new Set();

  for (let id of sourceIds) {
    // add to list if exists in original source but not in copied source
    if (!targetIds.has(id)) {
      idsToCopy.add(id);
    }
  }

  const latest = await Model.findOne()
    .sort('-date')
    .exec();

  debug(`adding ${idsToCopy.size} missing entries`);
  const chunks = chunk([...idsToCopy], MAX_ELEMENTS_ID_CLAUSE);

  for (let chunk of chunks) {
    await driverGetSourceData(
      options,
      (data) => copyEntries(data, options),
      latest.date,
      chunk
    );
  }
}

module.exports = copyMissingIds;
