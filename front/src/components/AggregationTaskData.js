import React from 'react';

import TaskTriggerButton from './TaskTriggerButton';
import AggregationSources from './AggregationSources';

export default function AggregationTaskData(props) {
  const { task, triggerTask } = props;
  if (!task) return null;
  return (
    <>
      <AggregationSources task={task} enableClick />
      <div className="mt-4">
        <TaskTriggerButton
          triggerTask={triggerTask}
          description="Trigger aggregation"
        />
      </div>
    </>
  );
}
