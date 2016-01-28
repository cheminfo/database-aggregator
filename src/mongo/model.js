'use strict';

const mongoose = require('mongoose');
const entrySchema = require('../schema/entry');

const models = new Map();

exports.getEntry = function (name) {
    const coll_name = 'entry_' + name;
    if (models.has(coll_name)) {
        return models.get(coll_name);
    }
    const model = mongoose.model(coll_name, entrySchema, coll_name);
    models.set(coll_name, model);
    return model;
};
