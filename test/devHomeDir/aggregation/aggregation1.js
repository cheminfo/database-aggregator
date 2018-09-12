'use strict';

/** @type {import('../../../src/types').IAggregationConfigFile} */
const aggregation = {
  sources: {
    source1: (data, result) => {
      result.source1 = data[0];
    }
  }
};

module.exports = aggregation;
