import React from 'react';

import TaskTriggerButton from './TaskTriggerButton';
import AggregationSources from './AggregationSources';
import Button from './Button';

export default function AggregationTaskData(props) {
  const { task, triggerTask, resetDatabase } = props;
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
      <div>
        <Button
          description="Reset database"
          color="red"
          onClick={resetDatabase}
        />
      </div>
    </>
  );
}
