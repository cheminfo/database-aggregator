# database-aggregator


## Features

  * Sourcing from Oracle databases to MongoDB collections
  * Aggregation of sources collections from MongoDB to MongoDB collections
  * A server for serve the aggregate collections


## Quick Start

  The quickest way to get started with database-aggregator is to clone the repository in your work folder to generate an application as shown below:
  
```bash 
$ git clone "https://github.com/cheminfo/database-aggregator.git" "/labs/database-aggregator"
```

  Install dependencies:

```bash
$ npm install
```

  Set your debug level:
  
```bash
$ DEBUG=*
```  
 
 Set your home directory:
 (see examples directory for create the basic structure)

 ```bash
$ DATABASE_AGGREGATOR_HOME_DIR=/labs/homeDir
```  
 
  Sourcing from Oracle:

```bash
$ node /labs/database-aggregator/bin/source.js
```

  Aggregation:

```bash
$ node /labs/database-aggregator/bin/aggregation.js
```

  Start the server:

```bash
$ node /labs/database-aggregator/bin/server.js
```

## Philosophy


## Examples

see examples directory

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## People

[List of all contributors](https://github.com/cheminfo/database-aggregator/graphs/contributors)

## License

[MIT](LICENSE)
  

## Troubleshooting

  MongoError:
```bash
 aggregate:debug (bin:aggregate) Begin aggregate of test_001 +0ms
{ [MongoError: getMore executor error: Overflow sort stage buffered data usage of 33554601 bytes exceeds internal limit of 33554432 bytes]
  name: 'MongoError',
  message: 'getMore executor error: Overflow sort stage buffered data usage of 33554601 bytes exceeds internal limit of 33554432 bytes' }
  aggregate:debug (bin:aggregate) End aggregate of test_001 in 355ms +355ms
```
Solved by reduce the "chunkSize" parameter in your aggregate file:
```bash
[...]
module.exports = {
    disabled:false,
    chunkSize: 100,
    sources: {
      [...]
    }
};
```
