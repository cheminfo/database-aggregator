'use strict';

const validation = require('../validation');

describe('aggregation validation', () => {
  it('should throw on wrong config object', async () => {
    const err = /^aggregation configuration must be an object$/;
    await expect(() => validation.aggregation()).toThrow(err);
    await expect(() => validation.aggregation(42)).toThrow(err);
    await expect(() => validation.aggregation(null)).toThrow(err);
  });

  it('should throw if collection is not a string', () => {
    return expect(() => validation.aggregation({ collection: 42 })).toThrow(
      /^config\.collection must be a string$/
    );
  });

  it('should throw if sources is not an object', async () => {
    const err = /^config\.sources must be an object$/;
    await expect(() =>
      validation.aggregation({ collection: 'dummy', sources: null })
    ).toThrow(err);
    await expect(() =>
      validation.aggregation({ collection: 'dummy', sources: 42 })
    ).toThrow(err);
  });

  it('should throw if chunkSize is not an integer', async () => {
    const err = /^config\.chunkSize must be a positive integer$/;
    await expect(() =>
      validation.aggregation({
        collection: 'dummy',
        sources: { a: 1 },
        chunkSize: 0.1
      })
    ).toThrow(err);
    await expect(() =>
      validation.aggregation({
        collection: 'dummy',
        sources: { a: 1 },
        chunkSize: -1
      })
    ).toThrow(err);
    await expect(() =>
      validation.aggregation({
        collection: 'dummy',
        sources: { a: 1 },
        chunkSize: 0
      })
    ).toThrow(err);
  });

  it('should throw if sources is an empty object', () => {
    return expect(() =>
      validation.aggregation({ collection: 'dummy', sources: {} })
    ).toThrow(/^config\.sources must have at least one source$/);
  });

  it('should throw if sources properties are not functions', () => {
    return expect(() =>
      validation.aggregation({
        collection: 'dummy',
        sources: {
          source1: 'abc'
        }
      })
    ).toThrow(
      'all sources in the aggregation config should be functions (source1)'
    );
  });
});
