# HTTP API

| Route                         | Method | Description                                                          | Query params     |
| ----------------------------- | ------ | -------------------------------------------------------------------- | ---------------- |
| `/schedular/all`              | `GET`  | Get data for all tasks                                               | `since`, `limit` |
| `/scheduler/trigger/:taskId`  | `GET`  | Queue a new process given the task id                                |                  |
| `/scheduler/tasks`            | `GET`  | Get latest data for each unique task                                 | `since`, `limit` |
| `/db/:aggregationName/id/:id` | `GET`  | Get an entry for a specific aggregation collection with the given id |                  |
