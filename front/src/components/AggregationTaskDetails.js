import React, { Fragment } from 'react';

import TaskHistory from './TaskHistory';
import DatePicker from './DatePicker';
import TaskDetailProvider from './TaskDetailProvider';
import AggregationTaskData from './AggregationTaskData';

export default function AggregationTaskDetails({ match }) {
  return (
    <TaskDetailProvider
      match={match}
      type="aggregation"
      component={AggregationTaskDetailsComponent}
    />
  );
}

function AggregationTaskDetailsComponent({
  task,
  onDatesChange,
  startDate,
  endDate,
  loadingHistory,
  history,
  name,
  triggerTask,
  resetDatabase
}) {
  return (
    <Fragment>
      <h1 className="mb-4">{name}</h1>
      <div className="w-full">
        <AggregationTaskData
          task={task}
          triggerTask={triggerTask}
          resetDatabase={resetDatabase}
        />
        <div className="w-full">
          <div className="mb-4 mx-2">
            <div className="text-l font-bold mb-3">Task history</div>
            <DatePicker
              onDatesChange={onDatesChange}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          {loadingHistory ? 'Loading...' : <TaskHistory history={history} />}
        </div>
      </div>
    </Fragment>
  );
}
