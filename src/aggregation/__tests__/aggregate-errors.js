'use strict';

const aggregate = require('../aggregate');

describe('aggregate errors', () => {
  it('should throw on wrong config object', async () => {
    const err = /^aggregation configuration must be an object$/;
    await expect(aggregate()).rejects.toThrow(err);
    await expect(aggregate(42)).rejects.toThrow(err);
    await expect(aggregate(null)).rejects.toThrow(err);
  });

  it('should throw if collection is not a string', () => {
    return expect(aggregate({ collection: 42 })).rejects.toThrow(
      /^config\.collection must be a string$/
    );
  });

  it('should throw if sources is not an object', async () => {
    const err = /^config\.sources must be an object$/;
    await expect(
      aggregate({ collection: 'dummy', sources: null })
    ).rejects.toThrow(err);
    await expect(
      aggregate({ collection: 'dummy', sources: 42 })
    ).rejects.toThrow(err);
  });

  it('should throw if chunkSize is not an integer', async () => {
    const err = /^config\.chunkSize must be a positive integer$/;
    await expect(
      aggregate({ collection: 'dummy', sources: { a: 1 }, chunkSize: 0.1 })
    ).rejects.toThrow(err);
    await expect(
      aggregate({ collection: 'dummy', sources: { a: 1 }, chunkSize: -1 })
    ).rejects.toThrow(err);
    await expect(
      aggregate({ collection: 'dummy', sources: { a: 1 }, chunkSize: 0 })
    ).rejects.toThrow(err);
  });

  it('should throw if sources is an empty object', () => {
    return expect(
      aggregate({ collection: 'dummy', sources: {} })
    ).rejects.toThrow(/^config\.sources must have at least one source$/);
  });

  it('should throw if sources properties are not functions', () => {
    return expect(
      aggregate({
        collection: 'dummy',
        sources: {
          source1: 'abc'
        }
      })
    ).rejects.toThrow(
      'all sources in the aggregation config should be functions (source1)'
    );
  });
});
