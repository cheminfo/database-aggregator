'use strict';

const debug = require('../../util/debug')('model:source');

const model = require('./../model');

exports.getCommonIds = function (name, fromSeq, chunkSize) {
  debug.trace(`getCommonIds for source ${name} from seq ${fromSeq}`);
  fromSeq = fromSeq || 0;
  var Model = model.getSource(name);
  const query = { sequentialID: {} };
  if (fromSeq !== undefined) {
    query.sequentialID.$gt = fromSeq;
  }
  const find = Model.find(query).select({ commonID: 1, sequentialID: 1 });
  if (chunkSize !== undefined) {
    find.limit(chunkSize);
  }
  find.sort({ sequentialID: 1 });
  return find.exec();
};

exports.getLastSeqId = function (name) {
  const Model = model.getSource(name);
  return Model.findOne({}).sort({ sequentialID: 'desc' });
};

exports.getByCommonId = function (name, commonId) {
  debug.trace(`get source ${name}, commonID: ${commonId}`);
  var Model = model.getSource(name);
  // Don't include deleted data
  return Model.find({ commonID: commonId, data: { $ne: null } }).exec();
};
