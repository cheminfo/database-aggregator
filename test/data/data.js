'use strict';

const connection = require('../../src/mongo/connection');
const model = require('../../src/mongo/model');

const collections = ['miscelaneous', 'names', 'prices'];

module.exports = function () {
  return connection()
    .then(() => model.getSourceSequence().remove({}))
    .then(() => model.getAggregationSequence().remove({}))
    .then(() => {
      // Drop collections
      return Promise.all(
        collections.map((collection) => {
          try {
            let Model = model.getSource(collection);
            return Model.remove({});
          } catch (e) {
            return Promise.resolve();
          }
        })
      ).then(() => {
        return Promise.all(
          collections.map((collection) => {
            // eslint-disable-next-line import/no-dynamic-require
            var data = require(`./${collection}.json`);
            return Promise.all(
              data.map((source) => {
                let Model = model.getSource(collection);
                var e = new Model(source);
                return e.save();
              })
            );
          })
        );
      });
    });
};
