import React, { Fragment } from 'react';

import TaskHistory from './TaskHistory';
import DatePicker from './DatePicker';
import TaskDetailProvider from './TaskDetailProvider';

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
  onDatesChange,
  startDate,
  endDate,
  loadingHistory,
  history,
  name
}) {
  return (
    <Fragment>
      <h1 className="mb-4">{name}</h1>
      <div className="flex">
        <div className="flex-1">Other</div>
        <div className="flex-1">
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
