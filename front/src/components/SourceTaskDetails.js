import React from 'react';

import TaskHistory from './TaskHistory';
import DatePicker from './DatePicker';
import TaskDetailProvider from './TaskDetailProvider';
import SourceTaskData from './SourceTaskData';

export default function SourceTaskDetails({ match }) {
  return (
    <TaskDetailProvider
      type="source"
      match={match}
      component={SourceTaskDetailsComponent}
    />
  );
}

function SourceTaskDetailsComponent({
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
    <>
      <h1 className="mb-4">{name}</h1>
      <div className="flex">
        <div className="flex-1">
          <SourceTaskData
            task={task}
            triggerTask={triggerTask}
            resetDatabase={resetDatabase}
          />
        </div>
        <div className="flex-1">
          <div className="mb-4 mx-2">
            <div className="text-l font-bold mb-3">Task history</div>
            <DatePicker
              onDatesChange={onDatesChange}
              startDate={startDate}
              endDate={endDate}
            />
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
