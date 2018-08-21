# Configuration

Here we detail how the database aggregator is configured

## Main configuration object

The scheduler will read the `config.js` file in the "home directory". The home directory can be set using the environment variable `DATABASE_AGGREGATOR_HOME_DIR`.

The `config.js` should be a commonjs module that exports the configuration object. It contains general configuration options related to the database connection and the scheduling options.

### Properties

- `url`- mongodb connection string
- `database` - mongodb database name
- `port` - Server port
- `schedulerThreadsSource` - Maximum number of parallel threds for source synchronization processen
- `schedulerThreadsAggregation` - Maximum number of parallel threads for aggregation processes
- `removeThreshold` - The percentage of deleted data to justify running the delete thread

### Example

```js
'use strict';

module.exports = {
  url: 'mongodb://localhost:27017',
  database: 'test',
  port: 6768,
  schedulerThreadsSource: 4,
  schedulerThreadsAggregation: 4,
  removeThreshold: 0.01
};
```

## Source configuration directory

The source directory should be located inside the home directory under the name `source`. The scheduler will recursively scan all subdirectories and load any javascript file. The js file should be commonjs modules that exports source configuration object. Example:

### Properties

- `driver` - The name of the driver. See driver section.
- `copyCronRule` - How often copying source data should occur in cron rule format
- `copyMissingIdsCronRule` - How often we should copy missed source entries in crone rule format,
- `removeCronRule` -How often we should clean the target from deleted entries in cron rule format

The cron rules are parsed using the [node-schedule npm package](https://github.com/node-schedule/node-schedule)

```js
'use strict';

module.exports = {
  driver: 'driver_name',
  copyCronRule: '0 * * * *', // every hour
  copyMissingIdsCronRule: '0 0 * * *', // every day
  removeCronRule: '0 0 * * *' // every day
};
```

The full source configuration will be passed to the driver, so the source configuration object will likely require other properties that will be used by the driver. For example the [oracle-driver](https://github.com/cheminfo/database-aggregator-driver-oracle) requires the `connectString` and `query` fields.

## Aggregation configuration directory

TODO

## Drivers

It is up to the user to define drivers for the synchronization with an external data source. A real driver example is available [here](https://github.com/cheminfo/database-aggregator-driver-oracle)
Driver definition:

```js
'use strict';

module.exports = {
  getData: function getData(config, callback, meta) {
    // config contains the source configuration object that was loaded by the scheduler
    // meta contains information about the current state of the target database. It has 2 properties:
    //   - latestDate: the last date of modification
    //   - ids: the full list of ids
    // The goal of meta information is to allow incremental updates by retrieving only what has been changed or added since the last synchronization.
    // callback is the function to call once the data has been retrieved
    // callback should be called with a well defined structure
    // ID uniquely identifies each source entry
    // commonID is used to identify the target entry in the aggregation collection
    callback([
      {
        modificationDate: new Date(),
        id: 'id1',
        commonID: 'commonID',
        data: {}
      }
    ]);
  },
  getIds() {
    // Should return the complete list of identifier in the source
    // This will be used by the synchronization of missing ids
    return ['id1'];
  }
};
```
