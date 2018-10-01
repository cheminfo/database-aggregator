'use strict';

/** @type {import('../../../src/types').ISourceDriverConfig} */
const driver = {
  async getData(config, callback, meta) {
    await wait(30);
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

function wait(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.floor(seconds * 1000));
  });
}

module.exports = driver;
