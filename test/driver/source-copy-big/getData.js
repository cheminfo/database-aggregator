'use strict';

async function getData(config, callback, options) {
  const { latestDate } = options;
  if (latestDate === null) {
    return callback([
      {
        id: 'a'.repeat(2000),
        commonID: 'b'.repeat(2000),
        modificationDate: new Date(0),
        data: { x: 42 }
      }
    ]);
  }
  return null;
}

module.exports = getData;
