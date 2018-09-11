'use strict';

/** @type {import('../../../src/types').ISourceDriverConfig} */
const driver = {
  getData(config, callback, meta) {
    callback([
      {
        id: 123,
        commonID: 123,
        data: { value: Math.random() },
        modificationDate: new Date()
      }
    ]);
  }
};

module.exports = driver;
