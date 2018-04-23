'use strict';

const connection = require('../../src/mongo/connection');

const collections = ['miscelaneous', 'names', 'prices'];
const model = require('../../src/mongo/model');

module.exports = function () {
  return connection()
    .then(() => model.getSourceSequence().remove({}))
    .then(() => model.getSeqIdAggregated().remove({}))
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
