'use strict';

const model = require('../mongo/model');
const mongodbConnect = require('../mongo/connection');

const copyEntries = require('./copyEntries');
const getDriver = require('./getDriver');

async function copy(config) {
  const driver = getDriver(config.driver);

  const collection = config.collection;
  if (typeof collection !== 'string' || collection === '') {
    throw new TypeError('collection must be a string');
  }
  const Model = model.getSource(collection);

  await mongodbConnect();

  const latest = await Model.findOne()
    .sort('-date')
    .exec();

  await driver.getData(config, (data) => copyEntries(data, config), {
    latestDate: latest && latest.date
  });
}

module.exports = copy;
