'use strict';

module.exports = {
  copyCronRule: '* * * * *',
  driver: {
    getData: async function getData(config, callback, meta) {
      return null;
    },
    getIds() {
      return [];
    }
  }
};
