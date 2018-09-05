import { connect } from '../mongo/connection';
import { getSource } from '../mongo/model';

import { getNextSequenceID } from '../mongo/models/sourceSequence';
import { ISourceConfigElement } from '../types';
import { debugUtil } from '../util/debug';
import { getDriver } from './getDriver';

const debug = debugUtil('source:remove');

export async function remove(config: ISourceConfigElement) {
  const driver = getDriver(config.driver);

  // Get complete list of source Ids
  let sourceIds = await driver.getIds(config.driverConfig);
  if (!(sourceIds instanceof Set)) {
    sourceIds = new Set(sourceIds);
  }

  const collection = config.collection;
  const Model = getSource(collection);

  await connect();

  // Element that are found in copied source but not in original source ought to be deleted
  // We do this by setting data to null, so that aggregation knows about the deletion
  const copiedIds = await Model.find({ data: { $ne: null } }, { id: 1 })
    .lean()
    .exec();
  const idsToDelete = new Set();

  for (const { id } of copiedIds) {
    if (!sourceIds.has(id)) {
      idsToDelete.add(id);
    }
  }
  const removeThreshold =
    config.removeThreshold === undefined ? 0.01 : config.removeThreshold;
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
    await Model.updateOne(
      { id },
      {
        $set: {
          data: null,
          date: new Date(),
          sequentialID: await getNextSequenceID(collection)
        }
      }
    ).exec();
  }
}
