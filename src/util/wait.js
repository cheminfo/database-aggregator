'use strict';
const debug = require('./debug')('utils');

module.exports = function (ms) {
    debug.trace(`wait ${ms} miliseconds`);
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
};
