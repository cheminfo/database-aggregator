'use strict';

const copyOracle = require('../driver/oracle');

exports.copy = function (options) {
    switch (options.driver) {
        case 'oracle':
            return copyOracle(options);
        default:
            throw new Error(`invalid driver option: ${options.driver}`);
    }
};
