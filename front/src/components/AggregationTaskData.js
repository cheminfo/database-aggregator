import React from 'react';

import TaskTriggerButton from './TaskTriggerButton';

export default function AggregationTaskData(props) {
  const { task, triggerTask } = props;
  if (!task) return null;
  return (
    <>
      <div className="font-bold mb-2">Sources</div>
      <div>todo put sources list</div>
      <div className="mt-4">
        <TaskTriggerButton
          triggerTask={triggerTask}
          description="Trigger aggregation"
        />
      </div>
    </>
  );
}
