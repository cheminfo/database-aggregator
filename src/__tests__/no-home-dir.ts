test('loading the library should fail if there is no home directory', () => {
  delete process.env.DATABASE_AGGREGATOR_HOME_DIR;
  expect(() => {
    require('../index');
  }).toThrow(
    /^The DATABASE_AGGREGATOR_HOME_DIR environment variable must be set$/
  );
});
