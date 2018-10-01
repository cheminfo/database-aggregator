import React from 'react';

import TaskTriggerButton from './TaskTriggerButton';
import AggregationSources from './AggregationSources';
import ResetButton from './ResetButton';
import Error from './Error';

export default function AggregationTaskData(props) {
  const { task, triggerTask, resetDatabase, error } = props;
  if (!task) return null;
  if (error) return <Error message={error} />;
  return (
    <>
      <AggregationSources task={task} enableClick />
      <div className="flex my-4">
        <TaskTriggerButton
          triggerTask={triggerTask}
          description="Trigger aggregation"
        />
        <ResetButton resetDatabase={resetDatabase} />
      </div>
    </>
  );
}
