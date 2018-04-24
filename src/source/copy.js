'use strict';

const model = require('../mongo/model');
const mongodbConnect = require('../mongo/connection');

const copyEntries = require('./copyEntries');
const getDriverFunction = require('./getDriverFunction');

async function copy(options) {
  const driverGetSourceData = getDriverFunction(
    options.driver,
    'getSourceData'
  );

  const collection = options.collection;
  const Model = model.getSource(collection);

  await mongodbConnect();

  const latest = await Model.findOne()
    .sort('-date')
    .exec();

  await driverGetSourceData(
    options,
    (data) => copyEntries(data, options),
    latest.date
  );
}

module.exports = copy;
