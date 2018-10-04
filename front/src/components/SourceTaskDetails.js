import React from 'react';

import TaskHistory from './TaskHistory';
import DatePicker from './DatePicker';
import TaskDetailProvider from './TaskDetailProvider';
import SourceTaskData from './SourceTaskData';
import { Polling } from './Polling';
import Error from './Error';
import moment from 'moment';
import DateTime from './DateTime';

const type = 'source';

export default function SourceTaskDetails({ match }) {
  return (
    <TaskDetailProvider
      type={type}
      match={match}
      component={SourceTaskDetailsComponent}
    />
  );
}

function SourceTaskDetailsComponent({
  onDatesChange,
  startDate,
  endDate,
  loadingHistory,
  refreshHistory,
  fetchTime,
  history,
  name,
  triggerTask,
  resetDatabase
}) {
  return (
    <>
      <h1 className="mb-4">{name}</h1>
      <div className="w-full">
        <Polling interval={10000} url={`/scheduler/${type}/${name}`}>
          {({ data, error }) => {
            if (error) return <Error message={error} />;
            return (
              <SourceTaskData
                task={data}
                triggerTask={triggerTask}
                error={error}
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
            <DateTime description="last fetched" light date={fetchTime} />
          </div>
          {loadingHistory ? (
            'Loading...'
          ) : (
            <TaskHistory history={history} includeType />
          )}
        </div>
      </div>
    </>
  );
}
