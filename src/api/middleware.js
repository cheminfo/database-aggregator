'use strict';

const model = require('../mongo/model');
const aggregation = require('../mongo/models/aggregation');

exports.getData = function* (next) {
    const since = +this.query.since || 0;
    const limit = +this.query.limit || 100;
    const db = this.params.name;

    const Model = model.getAggregation(db);
    const d = yield Model.find({seqid: {$gt: since}})
        .sort({seqid: 'asc'})
        .select({seqid: 1, value: 1})
        .limit(limit).exec();

    var body = {
        lastSeqId: d.length ? d[d.length-1].seqid : undefined,
        data: d.map(d => d.value)
    };

    this.body = body;
    this.status = 200;

    yield next;
};

exports.getInfo = function * (next) {
    const since = +this.query.since || 0;
    const db = this.params.name;


    this.body = {
        data: {
            remaining: yield aggregation.countFromSeqId(db, since),
            total: yield aggregation.count(db)
        }
    };
    this.status = 200;
    yield next;
};
