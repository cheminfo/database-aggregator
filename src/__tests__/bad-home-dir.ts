test('the home directory must exist', () => {
  process.env.DATABASE_AGGREGATOR_HOME_DIR = '/bad/home/directory';
  expect(() => {
    require('../index');
  }).toThrow(/^Cannot find module/);
});
