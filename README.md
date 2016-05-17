# database-aggregator
Map sql collections to MongoDB

## Quick Start
```bash 
$ git clone https://github.com/cheminfo/database-aggregator.git
```

Install dependencies:
```bash
$ npm install
```

  Set your debug level:
  
```bash
$ DEBUG=*
```  
 
Set your home directory (see examples directory for create the basic structure):

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

## People
[List of all contributors](https://github.com/cheminfo/database-aggregator/graphs/contributors)

## License
[MIT](LICENSE)

