'use strict';

const model = require('../../mongo/model');
const aggregation = require('../../mongo/models/aggregation');

exports.getData = function* (next) {
    const since = +this.query.since || 0;
    const limit = +this.query.limit || 100;
    const db = this.params.name;

    const Model = yield model.getAggregationIfExists(db);
    var d;
    if(!Model) {
        d = [];
    } else {
        d = yield Model.find({seqid: {$gt: since}})
            .sort({seqid: 'asc'})
            .select({_id: 0, __v: 0})
            .limit(limit).lean(true).exec();
    }


    var body = {
        lastSeqId: d.length ? d[d.length-1].seqid : 0,
        data: d
    };

    this.body = body;
    this.status = 200;

    yield next;
};

exports.getInfo = function * (next) {
    const since = +this.query.since || 0;
    const db = this.params.name;

    const Model = yield model.getAggregationIfExists(db);
    if(!Model) {
        this.body = {
            data: {
                remaining: 0,
                total: 0
            }
        }
    } else {
        this.body = {
            remaining: yield Model.count({seqid: {$gt: since}}),
            total: yield Model.count()
        }
    }

    this.status = 200;
    yield next;
};
