'use strict';

const { prepare } = require('../test/helper.js');

prepare()
  .then(() => {
    console.log('test env preparation done');
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  })
  .catch((e) => {
    console.error(e.message);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
