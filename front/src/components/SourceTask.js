import React from 'react';

import SourceNextExecutions from './SourceNextExecutions';

export default function SourceTask(props) {
  const { task } = props;

  return (
    <div>
      <div className="font-bold text-xl mb-2">{task.collection}</div>
      <div>
        <div className="font-bold mb-2">Next executions</div>
        <SourceNextExecutions task={task} />
      </div>
    </div>
  );
}
