'use strict';

const { getDriverPath } = require('../../../test/util');
const copy = require('../copy');

describe('source copy errors', () => {
  it('shoud fail when driver config is missing', () => {
    return expect(copy({ driver: undefined })).rejects.toThrow(
      /^driver is missing in config$/
    );
  });

  it('should fail to get inexistant driver', () => {
    return expect(copy({ driver: 'notfound' })).rejects.toThrow(
      /^driver not found: .*driver\/notfound$/
    );
  });

  it('should fail if driver throws on load', () => {
    return expect(
      copy({ driver: getDriverPath('source-error/throw') })
    ).rejects.toThrow(/^bad driver$/);
  });

  it('should fail if driver does not export an object', async () => {
    await expect(
      copy({ driver: getDriverPath('source-error/number') })
    ).rejects.toThrow(/^driver must be an object$/);
    await expect(
      copy({ driver: getDriverPath('source-error/null') })
    ).rejects.toThrow(/^driver must be an object$/);
  });

  it('should fail if driver forgets to export methods', async () => {
    await expect(
      copy({ driver: getDriverPath('source-error/missing-getdata') })
    ).rejects.toThrow(/^driver must provide a method named "getData"$/);
    await expect(
      copy({ driver: getDriverPath('source-error/missing-getids') })
    ).rejects.toThrow(/^driver must provide a method named "getIds"$/);
  });

  it('should throw if collection is not in config', () => {
    return expect(
      copy({ driver: getDriverPath('source-1'), collection: null })
    ).rejects.toThrow(/^collection must be a string$/);
  });
});
