import React from 'react';

import SourceTaskCron from './SourceTaskCron';

export default function SourceTask(props) {
  const { task } = props;
  
  const hasNextExecutions =
    task.copyCronRule || task.copyMissingIdsCronRule || task.removeCronRule;
  return (
    <div>
      <div className="font-bold text-xl mb-2">{task.collection}</div>
      <div>
        <div className="font-bold mb-2">Next executions</div>
        {hasNextExecutions ? (
          <ul>
            <SourceTaskCron label="Copy" value={task.copyCronRule} />
            <SourceTaskCron
              label="Copy missing"
              value={task.copyMissingIdsCronRule}
            />
            <SourceTaskCron label="Remove" value={task.removeCronRule} />
          </ul>
        ) : (
          'Nothing planned'
        )}
      </div>
    </div>
  );
}
