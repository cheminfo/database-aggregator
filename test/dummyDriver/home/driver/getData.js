'use strict';

async function getData(config, callback, options) {
  const { ids, latestDate } = options;
  if (ids) {
    return callback([
      {
        id: 'test5',
        commonID: 'test5',
        modificationDate: new Date(1800),
        data: { x: 10, y: 11 }
      }
    ]);
  }
  if (latestDate === null) {
    return callback([
      {
        id: 'test1',
        commonID: 'test1',
        modificationDate: new Date(1000),
        data: { x: 1, y: 2 }
      }
    ]);
  } else if (latestDate.getTime() === 1000) {
    await callback([
      {
        id: 'test1',
        commonID: 'test1',
        modificationDate: new Date(1500),
        data: { x: 2, y: 3 }
      },
      {
        id: 'test2',
        commonID: 'test2',
        modificationDate: new Date(1600),
        data: { x: 4, y: 5 }
      }
    ]);

    return callback([
      {
        id: 'test4',
        commonID: 'test4',
        modificationDate: new Date(1600),
        data: { x: 8, y: 9 }
      }
    ]);
  } else if (latestDate.getTime() === 1600) {
    return callback([
      {
        id: 'test3',
        commonID: 'test3',
        modificationDate: new Date(2000),
        data: { x: 6, y: 7 }
      }
    ]);
  }
  return null;
}

module.exports = getData;