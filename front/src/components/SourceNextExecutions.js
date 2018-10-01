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
    return (
      <ul style={{ listStyle: 'none' }}>
        <SourceTaskCron
          label="Copy"
          status={task.copyState.status}
          value={task.copyCronRule}
        />
        <SourceTaskCron
          status={task.copyMissingIdsState.status}
          label="Copy missing"
          value={task.copyMissingIdsCronRule}
        />
        <SourceTaskCron
          status={task.removeState.status}
          label="Remove"
          value={task.removeCronRule}
        />
      </ul>
    );
  } else {
    return 'Nothing planned';
  }
}
