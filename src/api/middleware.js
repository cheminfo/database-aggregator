'use strict';

const model = require('../mongo/model');

exports.getData = function* (next) {
    console.log('request');
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
