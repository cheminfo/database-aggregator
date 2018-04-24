'use strict';

const copy = require('../copy');

describe('source copy errors', () => {
  it('should fail to get inexistant driver', () => {
    expect(copy({ driver: 'notfound' })).rejects.toThrow(
      /^driver not found: .*driver\/notfound$/
    );
  });
});
