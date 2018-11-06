import React from 'react';

import TaskHistory from './TaskHistory';
import DatePicker from './DatePicker';
import { Polling } from './Polling';
import Error from './Error';
import DateTime from './DateTime';

export default function TaskDetails({
  type,
  includeType,
  onDatesChange,
  startDate,
  endDate,
  loadingHistory,
  refreshHistory,
  fetchTime,
  history,
  name,
  triggerTask,
  resetDatabase,
  taskDataComponent: TaskData
}) {
  return (
    <>
      <h1 className="mb-4">{name}</h1>
      <div className="w-full">
        <Polling interval={10000} url={`/scheduler/${type}/${name}`}>
          {({ data, error }) => {
            if (error) return <Error message={error} />;
            return (
              <TaskData
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
            <TaskHistory history={history} includeType={includeType} />
          )}
        </div>
      </div>
    </>
  );
}
