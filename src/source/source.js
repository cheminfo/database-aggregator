'use strict';

exports.copy = function (options) {
    try {
        var copy = require(`../driver/${options.driver}/copy`);
    } catch (e) {
        onError(options);
    }
    return copy(options);
};

exports.remove = function (options) {
    try {
        var remove = require(`../driver/${options.driver}/remove`);
    } catch (e) {
        onError(options);
    }
    return remove(options);
};

exports.copyMissingIds = function (options) {
    try {
        var sync = require(`../driver/${options.driver}/copyMissingIds`);
    } catch (e) {
        onError(options);
    }
    return sync(options);
};

function onError(options) {
    throw new Error(`invalid driver option: ${options.driver}`);
}
