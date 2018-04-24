'use strict';

const mongoSetup = require('../../../test/mongoSetup');

beforeAll(mongoSetup.connect);
afterAll(mongoSetup.disconnect);

describe('source copy', () => {
  beforeEach(() => mongoSetup.insertData('test'));
  it('should work', () => {
    expect(1 + 1).toBe(2);
  });
});
