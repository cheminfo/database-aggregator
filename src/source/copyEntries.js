'use strict';

const isequal = require('lodash.isequal');

const model = require('../mongo/model');
const sourceSequence = require('../mongo/models/sourceSequence');

async function copyEntries(entries, options) {
  const collection = options.collection;
  const Model = model.getSource(collection);

  for (const entry of entries) {
    if (typeof entry.id !== 'string') {
      throw new TypeError('entry.id must be a string');
    }
    if (typeof entry.commonID !== 'string') {
      throw new TypeError('entry.commonID must be a string');
    }
    if (!(entry.modificationDate instanceof Date)) {
      throw new TypeError('entry.modificationDate must be a Date object');
    }
    if (typeof entry.data !== 'object' || entry.data === null) {
      throw new TypeError('entry.data must be an object');
    }

    let doc = await Model.findById(entry.id);

    let mustSave = false;
    if (!doc) {
      doc = new Model();
      doc._id = entry.id;
      doc.commonID = entry.commonID;
      doc.data = entry.data;
      mustSave = true;
    } else {
      if (doc.commonID !== entry.commonID) {
        doc.commonID = entry.commonID;
        mustSave = true;
      }
      if (!isequal(doc.data, entry.data)) {
        doc.data = entry.data;
        mustSave = true;
      }
      if (!isequal(doc.date, entry.modificationDate)) {
        mustSave = true;
      }
    }

    if (mustSave) {
      doc.sequentialID = await sourceSequence.getNextSequenceID(collection);
      doc.date = entry.modificationDate;
      await doc.save();
    }
  }
}

module.exports = copyEntries;
