'use strict';

const debug = require('../../util/debug')('model:source');

const model = require('./../model');

exports.getCommonIds = function (name, fromSeq, toSeq) {
  debug.trace(`getCommonIds for source ${name} from seq ${fromSeq}`);
  fromSeq = fromSeq || 0;
  var Model = model.getSource(name);
  return Model.find({ sequentialID: { $gt: fromSeq, $lte: toSeq } })
    .select({ commonID: 1, sequentialID: 1 })
    .sort({ _id: 'asc' })
    .exec();
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
