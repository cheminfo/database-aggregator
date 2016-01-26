function concatenateAll(names, miscelaneous, prices) {
    var commonIDs={};
    names.forEach(function(value) {commonIDs[value.commonID]=true});
    miscelaneous.forEach(function(value) {commonIDs[value.commonID]=true});
    prices.forEach(function(value) {commonIDs[value.commonID]=true});

    for (var commonID in commonIDs) {
        var data={};
        data.names=names
            .filter(value => value.commonID==commonID)
            .map(value => value.data);
        data.miscelaneous=miscelaneous
            .filter(value => value.commonID==commonID)
            .map(value => value.data);
        data.prices=prices.filter(value => value.commonID==commonID)
            .map(value => value.data);
        var result=concatenate(data, chemicalFilter);
        console.log(result);
    }
}


function concatenate(data, filter) {
    var result={};
    for (var key in filter) {
        if (data[key]) {
            filter[key].call(null, data[key], result);
        }
    }
    return result;
}