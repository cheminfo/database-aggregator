'use strict';

const model = require('../../mongo/model');
const aggregation = require('../../mongo/models/aggregation');
const seqid = require('../../mongo/models/seqIdCount');

exports.getDataById = function *() {
    const db = this.params.name;
    const id = this.params.id;

    const Model = yield model.getAggregationIfExists(db);
    var d;
    if(!Model) {
        d = null;
    } else {
        d = yield Model.findOne({id: id})
            .select({_id: 0, __v: 0})
            .lean(true).exec();
    }

    if(d === null){
        this.status = 404;
    }

    this.body = {
        data: d
    };
};

exports.getData = function *() {
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

    this.body = {
        lastSeqId: d.length ? d[d.length-1].seqid : 0,
        data: d
    };
};

exports.getInfo = function *() {
    const since = +this.query.since || 0;
    const db = this.params.name;

    const Model = yield model.getAggregationIfExists(db);
    if(!Model) {
        this.body = {
            remaining: 0,
            total: 0
        };
    } else {
        this.body = {
            remaining: yield Model.count({seqid: {$gt: since}}),
            total: yield Model.count()
        };
    }
};

exports.updateData = function *() {
    if (!this.request.body || (typeof this.request.body !== 'object')) {
        return error(this, 'body is not an object');
    }
    const body = this.request.body;
    const docID = body.id;
    const date = body.date;
    const value = body.value;
    if (!docID || !date || !value) {
        return error(this, 'missing ID, date or value');
    }

    const db = this.params.name;
    const Model = yield model.getAggregationIfExists(db);
    if (!Model) {
        return error(this, 'unknown database: ' + db);
    }

    const doc = yield Model.findById(docID);
    if (doc === null) {
        let newDoc = new Model({
            _id: docID,
            seqid: yield seqid.getNextSequenceID('aggregation_' + db),
            value,
            date,
            action: 'update',
            id: docID
        });
        yield newDoc.save();
        return this.body = {success: true, seqid: newDoc.seqid};
    } else if (doc.seqid === body.seqid) {
        doc.value = body.value;
        doc.date = body.date;
        doc.seqid = yield seqid.getNextSequenceID('aggregation_' + db);
        yield doc.save();
        return this.body = {success: true, seqid: doc.seqid};
    } else {
        this.status = 409;
        this.body = {error: true, reason: 'conflict'};
    }
};

function error(ctx, reason) {
    ctx.status = 400;
    return ctx.body = {error: true, reason};
}
