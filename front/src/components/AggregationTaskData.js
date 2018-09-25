import React from 'react';

import TaskTriggerButton from './TaskTriggerButton';
import AggregationSources from './AggregationSources';
import ResetButton from './ResetButton';

export default function AggregationTaskData(props) {
  const { task, triggerTask, resetDatabase } = props;
  if (!task) return null;
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
