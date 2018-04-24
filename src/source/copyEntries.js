'use strict';

const isequal = require('lodash.isequal');

const model = require('../mongo/model');
const sourceSequence = require('../mongo/models/sourceSequence');

async function copyEntries(entries, options) {
  const collection = options.collection;
  const Model = model.getSource(collection);

  for (const entry of entries) {
    if (
      !entry.id ||
      !entry.commonID ||
      !entry.modificationDate ||
      !entry.data
    ) {
      throw new Error(
        'entries must have the following properties: id, commonID, modificationDate, data'
      );
    }

    let doc = await Model.findById(entry.id);
    if (!doc) {
      doc = new Model();
      doc._id = entry.id;
      doc.commonID = entry.commonID;
    }

    if (!isequal(doc.data, entry.data)) {
      doc.data = entry.data;
      doc.date = entry.date;
      doc.sequentialID = await sourceSequence.getNextSequenceID(collection);
      await doc.save();
    } else {
      if (!isequal(doc.date, entry.date)) {
        doc.date = entry.date;
        await doc.save();
      }
    }
  }
}

module.exports = copyEntries;
