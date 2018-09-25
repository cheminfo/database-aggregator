import { getDriverPath } from '../../../test/util';
import { copy } from '../copy';

describe('source copy errors', () => {
  it('shoud fail when driver config is missing', () => {
    // @ts-ignore
    return expect(copy({ driver: undefined })).rejects.toThrow(
      /^driver must be a string or object$/
    );
  });

  it('should fail to get inexistant driver', () => {
    // @ts-ignore
    return expect(copy({ driver: 'notfound' })).rejects.toThrow(
      /^could not resolve driver location: notfound$/
    );
  });

  it('should fail if driver throws on load', () => {
    return expect(
      // @ts-ignore
      copy({ driver: getDriverPath('source-error/throw') })
    ).rejects.toThrow(/^bad driver$/);
  });

  it('should fail if driver does not export an object', async () => {
    await expect(
      // @ts-ignore
      copy({ driver: getDriverPath('source-error/number') })
    ).rejects.toThrow(/^driver module must be an object$/);
    await expect(
      // @ts-ignore
      copy({ driver: getDriverPath('source-error/null') })
    ).rejects.toThrow(/^driver module must be an object$/);
  });

  it('should fail if driver forgets to export methods', async () => {
    await expect(
      // @ts-ignore
      copy({ driver: getDriverPath('source-error/missing-getdata') })
    ).rejects.toThrow(/^driver must provide a method named "getData"$/);
    // @ts-ignore
    await expect(copy({ driver: {} })).rejects.toThrow(
      /^driver must provide a method named "getData"$/
    );
    await expect(
      // @ts-ignore
      copy({ driver: getDriverPath('source-error/missing-getids') })
    ).rejects.toThrow(/^driver must provide a method named "getIds"$/);
  });

  it('should throw if collection is not in config', () => {
    return expect(
      // @ts-ignore
      copy({ driver: getDriverPath('source-copy'), collection: null })
    ).rejects.toThrow(/^collection must be a string$/);
  });
});
