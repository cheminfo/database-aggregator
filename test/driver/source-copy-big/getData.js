'use strict';

const firstDay = new Date('1900-01-01').getTime();

async function getData(config, callback, meta) {
  const { latestDate } = meta;
  if (latestDate.getTime() === firstDay) {
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
