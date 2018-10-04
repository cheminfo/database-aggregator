import React, { Fragment } from 'react';

import TaskHistory from './TaskHistory';
import DatePicker from './DatePicker';
import TaskDetailProvider from './TaskDetailProvider';
import AggregationTaskData from './AggregationTaskData';
import { Polling } from './Polling';

const type = 'aggregation';

export default function AggregationTaskDetails({ match }) {
  return (
    <TaskDetailProvider
      match={match}
      type={type}
      component={AggregationTaskDetailsComponent}
    />
  );
}

function AggregationTaskDetailsComponent({
  onDatesChange,
  startDate,
  endDate,
  loadingHistory,
  refreshHistory,
  history,
  name,
  triggerTask,
  resetDatabase
}) {
  return (
    <Fragment>
      <h1 className="mb-4">{name}</h1>
      <div className="w-full">
        <Polling url={`/scheduler/${type}/${name}`} interval={-1}>
          {({ data, error }) => {
            return (
              <AggregationTaskData
                error={error}
                task={data}
                triggerTask={triggerTask}
                resetDatabase={resetDatabase}
              />
            );
          }}
        </Polling>
        <div className="w-full">
          <div className="mb-4 mx-2">
            <div className="text-l font-bold mb-3">Task history</div>
            <DatePicker
              onDatesChange={onDatesChange}
              startDate={startDate}
              endDate={endDate}
            />
            <span
              className="m-4 ml-8 p-2 border-grey-darker border rounded cursor-pointer"
              onClick={refreshHistory}
            >
              Refresh
            </span>
          </div>
          {loadingHistory ? 'Loading...' : <TaskHistory history={history} />}
        </div>
      </div>
    </Fragment>
  );
}
