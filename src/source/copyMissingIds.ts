'use strict';

const chunk = require('lodash.chunk');

const model = require('../mongo/model');
import { connect } from '../mongo/connection';
const debug = require('../util/debug')('source:copyMissingIds');

import { getDriver } from './getDriver';
import { copyEntries } from './copyEntries';
import { ISourceConfigElement } from '../types';

const MAX_ELEMENTS_ID_CLAUSE = 999;

// In a similar fashion to how remove works, finds all the ids
// that are present in the source but missing in the target
// and copies those to the target
async function copyMissingIds(config: ISourceConfigElement) {
  const driver = getDriver(config.driver);

  let sourceIds = await driver.getIds(config);
  if (!(sourceIds instanceof Set)) {
    sourceIds = new Set(sourceIds);
  }

  const collection = config.collection;
  const Model = model.getSource(collection);

  await connect();

  // Get all ids from copied source
  const targetIds: Set<string> = new Set(
    (await Model.find({ data: { $ne: null } }, { id: 1 })
      .lean()
      .exec()).map((t: any) => t.id)
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
    await driver.getData(config, data => copyEntries(data, config), {
      latestDate: (latest && latest.date) || new Date('1900-01-01'),
      ids: chunk
    });
  }
}

module.exports = copyMissingIds;
