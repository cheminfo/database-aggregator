# database-aggregator

## General principle

The database aggregator collects data from various sources and puts them into a mongoDB database. It doesn't do anything out of the box, you have to configure the sources and aggregations scripts yourself.

## Install

Clone the repo: `git clone https://github.com/cheminfo/database-aggregator.git`

Install dependencies: `npm install`

Install pm2: `npm i -g pm2`

Install pm2-bridge : `pm2 install pm2-bridge`

Copy pm2 configuration files and launch pm2 processes

```bash
cp server.example.pm2.json server.pm2.json
pm2 start server.pm2.json
cp scheduler.example.pm2.json scheduler.pm2.json
pm2 start scheduler.pm2.json
```

## Scripts

The database aggregator is composed of two main scripts. To enable all functionalities, those scripts have to be started with pm2, because some functionalities use inter-process communication, which is enabled by the pm2 module "pm2-bridge".

### HTTP API

The server script launches a web server which provides:

1. an API for simple read-only requests against the mongoDB source and aggregation databases
2. An API to read synchronization processes status and logs
3. an API to manage processes in the queue

```bash
pm2 start server.pm2.json
```

#### Environment variables

`DEBUG` sets the level of information to log in the console. There are 4 levels of debug: trace, debug, warn, error.
Examples:

```bash
DEBUG=aggregator:* # activate all debug levels
DEBUG=aggregator:warn,aggregator:error # activate warn and error debug levels
```

`DATABASE_AGGREGATOR_HOME_DIR` sets the configuration directory where the configuration is located. Example:

### Scheduler

The scheduler scripts reads the configuration files and schedules the source and aggregation scripts. Each source synchronization and aggregation is launched in a new child process. The scheduler keeps track of the status of each process and logs the information in the MongoDB database. The logged information is available to end users via the HTTP API. [Read here about how to write configuration files](./configuration.md)

To start the schedule: `pm2 start scheduler.pm2.json`
To start the server:

```bash
pm2 start scheduler.pm2.json
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

## Testing

### Setup environment with Docker (for runnings tests)

```bash
docker pull mongo
docker create -p 27017:27017 --name mongo mongo
docker start mongo
```

## License

[MIT](LICENSE)
