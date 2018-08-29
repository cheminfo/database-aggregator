'use strict';

import { getSource } from '../mongo/model';
import { connect } from '../mongo/connection';
import { ISourceConfigElement } from '../types';

import { copyEntries } from './copyEntries';
import { getDriver } from './getDriver';

export async function copy(config: ISourceConfigElement) {
  const driver = getDriver(config.driver);

  const collection = config.collection;
  if (typeof collection !== 'string' || collection === '') {
    throw new TypeError('collection must be a string');
  }
  const Model = getSource(collection);

  await connect();

  const latest = await Model.findOne()
    .sort('-date')
    .exec();

  await driver.getData(config, data => copyEntries(data, config), {
    latestDate: latest && latest.date
  });
}
