'use strict';

const { prepare } = require('../test/helper.js');

prepare()
  .then(() => {
    console.log('test env preparation done');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
