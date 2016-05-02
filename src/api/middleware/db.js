'use strict';

const model = require('../../mongo/model');
const aggregation = require('../../mongo/models/aggregation');

exports.getData = function* (next) {
    const since = +this.query.since || 0;
    const limit = +this.query.limit || 100;
    const db = this.params.name;

    if(model.existAggregation(db)){
        const Model = model.getAggregation(db);
        const d = yield Model.find({seqid: {$gt: since}})
            .sort({seqid: 'asc'})
            .select({_id: 0, __v: 0})
            .limit(limit).lean(true).exec();
    
        this.body = {
            lastSeqId: d.length ? d[d.length-1].seqid : 0,
            data: d
        };
        this.status = 200;
    }else{
        this.status = 400;
        this.body = {error:'this collection not exist'};
    }
    
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
