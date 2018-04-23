'use strict';

var pm2 = require('pm2');

var debug = require('../src/util/debug')('pm2-manager:main');

var scheduler;

pm2.connect(function () {
  pm2.list(function (err, res) {
    if (err) {
      throw err;
    }
    scheduler = res.find(function (r) {
      return r.name === 'database-aggregator-scheduler';
    });
  });

  pm2.launchBus(function (err, bus) {
    if (err) {
      debug.error(err);
      return;
    }
    bus.on('scheduler:trigger', function (packet) {
      if (scheduler) {
        pm2.sendDataToProcessId(
          scheduler.pm2_env.pm_id,
          {
            topic: 'action',
            type: 'scheduler:trigger',
            data: packet.data
          },
          function (err, res) {
            if (err) {
              debug.error(err.message);
            } else {
              debug.trace('sent data successfully to scheduler');
              debug.trace(res);
            }
          }
        );
      }
    });
  });
});
