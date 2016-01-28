'use strict';

const Promise = require('bluebird');
const isRunning = require('is-running');
const fs = require('fs');

const pidFile = __dirname + '/source.pid';

try {
    const pid = fs.readFileSync(pidFile, 'utf8');
    if (isRunning(pid)) {
        console.log(`process is running (pid: ${pid})`);
        process.exit(0);
    }
    console.log('pid file is here but process died');
    fs.unlinkSync(pidFile);
} catch (e) {}

const currentPid = process.pid;
fs.writeFileSync(pidFile, String(currentPid));

const copy = require('../src/source/copy');
const config = require('../src/config/config').globalConfig;

const source = config.source;
const sources = Object.keys(source);

Promise.coroutine(function* () {
    for (const collection of sources) {
        const options = source[collection];
        yield copy.copy(Object.assign({collection}, options));
    }
})().then(function () {
    console.log('finished');
    return 0;
}, function (e) {
    console.error(e);
    return 1;
}).then(function (code) {
    fs.unlinkSync(pidFile);
    process.exit(code);
});
