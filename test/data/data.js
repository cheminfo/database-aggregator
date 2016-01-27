'use strict';

const Entry = require('../../src/schema/entry');

const connection = require('../../src/mongo/connection');
const mongoose = require('mongoose');

const collections = ['miscelaneous', 'names', 'prices'];

module.exports = function () {
    return connection().then(() => {
        // Drop collections
        let models = {};
        return Promise.all(collections
            .map(collection => {
                try {
                    models[collection] = mongoose.model(collection, Entry, collection);
                    return models[collection].remove({});
                } catch(e) {
                    return Promise.resolve();
                }

            })
        ).then(() => {
            return Promise.all(collections.map(collection => {
                var data  = require(`./${collection}.json`);
                return Promise.all(data.map(entry => {
                    var e = new models[collection](entry);
                    return e.save();
                }));
            }));
        });
    });
};
