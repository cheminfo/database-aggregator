'use strict';

const path = require('path');
const fs = require('fs');
const isRunning = require('is-running');
const pidFile = path.join(__dirname, '../../source.pid');

let _started;

module.exports = {
    start: function () {
        if(_started) return;
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
    },

    stop: function (code) {
        code = code || 0;
        fs.unlinkSync(pidFile);
        process.exit(code);
    }
};