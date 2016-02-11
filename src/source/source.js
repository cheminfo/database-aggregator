'use strict';

exports.copy = function (options) {
    try {
        var copy = require(`../driver/${options.driver}/copy`);
    } catch(e) {
        onError(options);
    }
    return copy(options);
};

exports.remove = function(options) {
    try {
        var remove = require(`../driver/${options.driver}/remove`);
        return copy(options);
    } catch(e) {
        onError(options);
    }
    return remove(options);
};

function onError(options) {
    throw new Error(`invalid driver option: ${options.driver}`);
}