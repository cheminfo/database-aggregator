const isequal = require("lodash.isequal");

import { getSource } from "../mongo/model";
import { getNextSequenceID } from "../mongo/models/sourceSequence";
import { ISourceConfigElement, ISourceDriverEntry } from "../types";

export async function copyEntries(
  entries: ISourceDriverEntry[],
  options: ISourceConfigElement,
) {
  const collection = options.collection;
  const Model = getSource(collection);

  for (const entry of entries) {
    if (typeof entry.id !== "string") {
      throw new TypeError("entry.id must be a string");
    }
    if (typeof entry.commonID !== "string") {
      throw new TypeError("entry.commonID must be a string");
    }
    if (!(entry.modificationDate instanceof Date)) {
      throw new TypeError("entry.modificationDate must be a Date object");
    }
    if (typeof entry.data !== "object" || entry.data === null) {
      throw new TypeError("entry.data must be an object");
    }

    let doc = await Model.findOne({ id: entry.id });

    let mustSave = false;
    if (!doc) {
      doc = new Model();
      doc.id = entry.id;
      doc.commonID = entry.commonID;
      doc.data = entry.data;
      mustSave = true;
    } else {
      if (doc.commonID !== entry.commonID) {
        throw new Error("commonID may not be changed");
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
      doc.sequentialID = await getNextSequenceID(collection);
      doc.date = entry.modificationDate;
      await doc.save();
    }
  }
}
