import React from 'react';

import SourceTaskCron from './SourceTaskCron';

export default function SourceNextExecutions(props) {
  const { task } = props;
  if (!task.enabled) {
    return 'This task is disabled';
  }
  const hasNextExecutions =
    task.copyCronRule || task.copyMissingIdsCronRule || task.removeCronRule;
  if (hasNextExecutions) {
    const copyState = task.copyState;
    const copyMissingIdsState = task.copyMissingIdsState;
    const removeState = task.removeState;
    return (
      <ul style={{ listStyle: 'none' }}>
        <SourceTaskCron
          label="Copy"
          status={copyState && copyState.status}
          message={copyState && copyState.reason}
          value={task.copyCronRule}
        />
        <SourceTaskCron
          status={copyMissingIdsState && copyMissingIdsState.status}
          message={copyState && copyState.reason}
          label="Copy missing"
          value={task.copyMissingIdsCronRule}
        />
        <SourceTaskCron
          status={removeState && removeState.status}
          message={removeState && removeState.reason}
          label="Remove"
          value={task.removeCronRule}
        />
      </ul>
    );
  } else {
    return 'Nothing planned';
  }
}
