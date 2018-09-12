'use strict';

/** @type {import('../../../src/types').ISourceDriverConfig} */
const driver = {
  getData(config, callback, meta) {
    return callback([
      {
        id: '123',
        commonID: '123',
        data: { value: Math.random() },
        modificationDate: new Date()
      }
    ]);
  },
  getIds() {
    return ['123'];
  }
};

module.exports = driver;
