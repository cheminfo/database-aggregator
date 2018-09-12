const chunkLib = require('lodash.chunk');

import { connect } from '../mongo/connection';
import { getSource } from '../mongo/model';

import { ISourceConfigElement } from '../types';
import { debugUtil } from '../util/debug';
import { copyEntries } from './copyEntries';
import { getDriver } from './getDriver';
import { ISourceDocument } from '../internalTypes';

const debug = debugUtil('source:copyMissingIds');

const MAX_ELEMENTS_ID_CLAUSE = 999;

// In a similar fashion to how remove works, finds all the ids
// that are present in the source but missing in the target
// and copies those to the target
export async function copyMissingIds(config: ISourceConfigElement) {
  const driver = getDriver(config.driver);

  let sourceIds = await driver.getIds(config.driverConfig);
  if (!(sourceIds instanceof Set)) {
    sourceIds = new Set(sourceIds);
  }

  const collection = config.collection;
  const Model = getSource(collection);

  await connect();

  // Get all ids from copied source
  const targetIds: Set<string> = new Set(
    (await Model.find({ data: { $ne: null } }, { id: 1 }).lean()).map(
      (t: ISourceDocument) => t.id
    )
  );
  const idsToCopy = new Set();

  for (const id of sourceIds) {
    // add to list if exists in original source but not in copied source
    if (!targetIds.has(id)) {
      idsToCopy.add(id);
    }
  }

  const latest = await Model.findOne()
    .sort('-date')
    .exec();

  debug.debug(`adding ${idsToCopy.size} missing entries`);
  const chunks = chunkLib([...idsToCopy], MAX_ELEMENTS_ID_CLAUSE);

  for (const chunk of chunks) {
    await driver.getData(
      config.driverConfig,
      (data) => copyEntries(data, config),
      {
        latestDate: (latest && latest.date) || new Date('1900-01-01'),
        ids: chunk
      }
    );
  }
}
