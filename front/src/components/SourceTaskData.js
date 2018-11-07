import React from 'react';

import SourceNextExecutions from './SourceNextExecutions';
import TaskTriggerButton from './TaskTriggerButton';
import ResetButton from './ResetButton';

export default function SourceTaskData(props) {
  const { task, triggerTask, resetDatabase } = props;
  if (!task) return <div>heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee</div>;
  return (
    <div className="flex my-4">
      <div className="px-2">
        <div className="font-bold mb-2">Next executions</div>
        <SourceNextExecutions task={task} />
      </div>
      <div className="px-2">
        <TaskTriggerButton
          description="Trigger copy"
          triggerTask={() => triggerTask('copy')}
        />
        <TaskTriggerButton
          description="Trigger remove"
          triggerTask={() => triggerTask('remove')}
        />
        <TaskTriggerButton
          description="Trigger copy_missing_ids"
          triggerTask={() => triggerTask('copy_missing_ids')}
        />
      </div>
      <div className="px-2">
        <ResetButton resetDatabase={resetDatabase} />
      </div>
    </div>
  );
}
