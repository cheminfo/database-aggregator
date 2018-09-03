import { aggregation, source } from '../validation';

describe('source validation', () => {
  it('should return a new object', () => {
    const conf = {
      version: 1,
    };
    const validatedConfig = source(conf);
    expect(validatedConfig).toBeDefined();
    expect(validatedConfig).not.toBe(conf);
  });

  it('version should be a integer or undefined', () => {
    const conf = {
      version: '1',
    };
    expect(() => source(conf)).toThrow('source version must be a number');
  });
});

describe('aggregation validation', () => {
  it('should throw on wrong config object', async () => {
    const err = /^aggregation configuration must be an object$/;
    await expect(() => aggregation()).toThrow(err);
    await expect(() => aggregation(42)).toThrow(err);
    await expect(() => aggregation(null)).toThrow(err);
  });

  it('should throw if collection is not a string', () => {
    return expect(() => aggregation({ collection: 42 })).toThrow(
      /^config\.collection must be a string$/,
    );
  });

  it('should throw if sources is not an object', async () => {
    const err = /^config\.sources must be an object$/;
    await expect(() =>
      aggregation({ collection: 'dummy', sources: null }),
    ).toThrow(err);
    await expect(() =>
      aggregation({ collection: 'dummy', sources: 42 }),
    ).toThrow(err);
  });

  it('should throw if chunkSize is not an integer', async () => {
    const err = /^config\.chunkSize must be a positive integer$/;
    await expect(() =>
      aggregation({
        collection: 'dummy',
        sources: { a: 1 },
        chunkSize: 0.1,
      }),
    ).toThrow(err);
    await expect(() =>
      aggregation({
        collection: 'dummy',
        sources: { a: 1 },
        chunkSize: -1,
      }),
    ).toThrow(err);
    await expect(() =>
      aggregation({
        collection: 'dummy',
        sources: { a: 1 },
        chunkSize: 0,
      }),
    ).toThrow(err);
  });

  it('should throw if sources is an empty object', () => {
    return expect(() =>
      aggregation({ collection: 'dummy', sources: {} }),
    ).toThrow(/^config\.sources must have at least one source$/);
  });

  it('should throw if sources properties are not functions', () => {
    return expect(() =>
      aggregation({
        collection: 'dummy',
        sources: {
          source1: 'abc',
        },
      }),
    ).toThrow(
      'all sources in the aggregation config should be functions (source1)',
    );
  });

  it('should return a new object', () => {
    const aggConfig = {
      collection: 'dummy',
      sources: {
        source1: () => {
          // noop
        },
      },
    };
    const validatedConfig = aggregation(aggConfig);
    expect(validatedConfig).toBeDefined();
    return expect(validatedConfig).not.toBe(aggConfig);
  });

  it('should set the default chunkSize if not specified', () => {
    const aggConfig = {
      collection: 'dummy',
      sources: {
        source1: () => {
          // noop
        },
      },
    };
    let validatedConfig = aggregation(aggConfig);
    expect(validatedConfig.chunkSize).toEqual(1000);

    aggConfig.chunkSize = 10;
    validatedConfig = aggregation(aggConfig);
    expect(validatedConfig.chunkSize).toEqual(10);
  });
});
