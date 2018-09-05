'use strict';

module.exports = {
  disabled: true,
  driver: {
    getData: async function getData(config, callback, meta) {
      return null;
    },
    getIds() {
      return [];
    }
  }
};
