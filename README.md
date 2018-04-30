# database-aggregator

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

# Enable communication between scheduler and server processes

```bash
$ pm2 install pm2-bridge
```

## Testing

### Setup environment with Docker (for runnings tests)

```bash
docker pull mongo
docker create -p 27017:27017 --name mongo mongo
docker start mongo
```

## License

[MIT](LICENSE)
