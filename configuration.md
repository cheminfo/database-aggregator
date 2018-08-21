# Configuration

Here we detail how the database aggregator is configured

## Main configuration object

The scheduler will read the `config.js` file in the "home directory". The home directory can be set using the environment variable `DATABASE_AGGREGATOR_HOME_DIR`.

The `config.js` should be a commonjs module that exports the configuration object. It contains general configuration options related to the database connection and the scheduling options.

### Properties

- `url`- mongodb connection string
- `database` - mongodb database name
- `port` - Server port for the HTTP API
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

The source directory should be located inside the home directory under the name `source`. The scheduler will recursively scan all subdirectories and load any javascript file. The name of the file is important and will be used to identify the collection in which the data is saved. The js file should be commonjs modules that exports source configuration object.

### Properties

- `driver` - The name of the driver. See driver section.
- `copyCronRule` - How often copying source data should occur in cron rule format
- `copyMissingIdsCronRule` - How often we should copy missed source entries in crone rule format,
- `removeCronRule` -How often we should clean the target from deleted entries in cron rule format

The cron rules are parsed using the [node-schedule npm package](https://github.com/node-schedule/node-schedule)

### Example

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

The aggregation directory should be located inside the home directory. The scheduler will recursively search and load for `.js`. The js file should be a commonjs module and export an object.

### Properties

- `sources` - an object where each property represents a source dependency
  - `[any key]` - Specifies the callback that should be called when the aggregation is triggered. The callback will be called once for each commonID. See example below with callback parameters
    - ``

Aggregations don't need to be scheduled, they will be triggered automatically everytime a source dependency has been updated.

### Example

```js
'use strict';

module.exports = {
  sources: {
    miscelaneous: function(data, result, commonID, ids) {
      // data: array containing all source entries from miscelaneous for this commonID
      // result: the aggregation result
      // commonID: the aggregation entry id
      // ids: the list of miscelaneous ids for this commonID
    },
    prices: function(data, result, commonID, ids) {
      // Same as above, but for the prices source
    }
  }
};
```

## Drivers

It is up to the user to define drivers for the synchronization with an external data source. A real driver example is available [here](https://github.com/cheminfo/database-aggregator-driver-oracle)
Driver definition:

```js
'use strict';

module.exports = {
  getData: async function getData(config, callback, meta) {
    // Can be an async function / return a Promise
    // The synchronization is considered finished when the returned promise is fulfilled
    // It should resolve once all data has been synchronized
    // config contains the source configuration object that was loaded by the scheduler
    // meta contains information about the current state of the target database. It has 2 properties:
    //   - latestDate: the last date of modification - for the 1st synchronization, the date is January 1st, 1900
    //   - ids: the full list of ids
    // The goal of meta information is to allow incremental updates by retrieving only what has been changed or added since the last synchronization.
    // callback can be called as many times as necessary
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
