'use strict';

const errorMessage = `This is an error :)
The error is multiline
We want to test the system
This is a very long liiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiinnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnne
`;

/** @type {import('../../../src/types').ISourceDriverConfig} */
const driver = {
  getData() {
    throw new Error(errorMessage);
  },
  getIds() {
    return ['123'];
  }
};

module.exports = driver;
