import React from 'react';

import SourceNextExecutions from './SourceNextExecutions';
import TaskTriggerButton from './TaskTriggerButton';
import ResetButton from './ResetButton';

export default function SourceTaskData(props) {
  const { task, triggerTask, resetDatabase } = props;
  if (!task) return null;
  return (
    <>
      <div className="font-bold mb-2">Next executions</div>
      <SourceNextExecutions task={task} />
      <div className="mt-4">
        <TaskTriggerButton
          description="Trigger copy"
          triggerTask={() => triggerTask('copy')}
        />
        <br />
        <TaskTriggerButton
          description="Trigger remove"
          triggerTask={() => triggerTask('remove')}
        />
        <br />
        <TaskTriggerButton
          description="Trigger copy_missing_ids"
          triggerTask={() => triggerTask('copy_missing_ids')}
        />
      </div>
      <div>
        <ResetButton resetDatabase={resetDatabase} />
      </div>
    </>
  );
}
