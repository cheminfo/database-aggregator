# database-aggregator

## General principle

The database aggregator collects data from various sources and puts them into a mongoDB database. It doesn't do anything out of the box, you have to configure the sources and aggregations scripts yourself.

## Install

Install database-aggregator globally:

`npm install -g database-aggregator`

Start database aggregator

`DEBUG=aggregator:* DATABASE_AGGREGATOR_HOME_DIR=/path/to/homedir/ database-aggregator`

## Scripts

The database aggregator is composed of two main parts. The first is a scheduler which launches child process to execute synchronization and aggregation tasks. The other is an HTTP API to read data from the database and the act on the scheduler.

### HTTP API

The HTTP API provides

1. an API for simple read-only requests against the mongoDB source and aggregation databases
2. An API to read synchronization processes status and logs
3. an API to manage processes in the queue

[HTTP API Documentation](./http_api.md)

#### Environment variables

`DEBUG` sets the level of information to log in the console. There are 4 levels of debug: trace, debug, warn, error.
Examples:

```bash
DEBUG=aggregator:* # activate all debug levels
DEBUG=aggregator:warn,aggregator:error # activate warn and error debug levels
```

`DATABASE_AGGREGATOR_HOME_DIR` sets the configuration directory where the configuration is located

Additional configuration should be set in the home directory. See [how to write the configuration directory](./configuration.md)

### Scheduler

The scheduler scripts reads the configuration files and schedules the source and aggregation scripts. Each source synchronization and aggregation is launched in a new child process. The scheduler keeps track of the status of each process and logs the information in the MongoDB database. The logged information is available to end users via the HTTP API. [Read here about how to write configuration files](./configuration.md)

![image](https://user-images.githubusercontent.com/4118690/44406024-f4f2e980-a55a-11e8-8b10-fc689b4f3c87.png)
[Edit diagram](https://sketchboard.me/vBbwNWFtkgIq#/)

## Testing

### Setup environment with Docker (for runnings tests)

```bash
docker pull mongo
docker create -p 27017:27017 --name mongo mongo
docker start mongo
```

### Run tests

`npm test`

## License

[MIT](LICENSE)
