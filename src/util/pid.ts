/* eslint-disable no-process-exit */

const path = require("path");
const fs = require("fs");

const isRunning = require("is-running");

const pidFile = path.join(__dirname, "../../source.pid");

export function start() {
  try {
    const pid = fs.readFileSync(pidFile, "utf8");
    if (isRunning(pid)) {
      console.log(`process is running (pid: ${pid})`);
      process.exit(0);
    }
    console.log("pid file is here but process died");
    fs.unlinkSync(pidFile);
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log("pid file does not exist yet");
    } else {
      throw e;
    }
  }
  const currentPid = process.pid;
  fs.writeFileSync(pidFile, String(currentPid));
}

export function stop(code?: number) {
  code = code || 0;
  fs.unlinkSync(pidFile);
  process.exit(code);
}
