'use strict';

const { prepare } = require('../test/helper.js');

prepare()
  .then(() => {
    console.log('test env preparation done');
  })
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  });
