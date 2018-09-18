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
      <ul>
        <SourceTaskCron label="Copy" value={task.copyCronRule} />
        <SourceTaskCron
          label="Copy missing"
          value={task.copyMissingIdsCronRule}
        />
        <SourceTaskCron label="Remove" value={task.removeCronRule} />
      </ul>
    );
  } else {
    return 'Nothing planned';
  }
}
