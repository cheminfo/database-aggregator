'use strict';

const ONE_HOUR =  60 * 60;
const ONE_DAY = ONE_HOUR * 24;

module.exports = {
    url: 'mongodb://localhost:27017',
    database: 'test',
    port: 6768,
    updateInterval: ONE_HOUR,
    deleteInterval: ONE_DAY
};
