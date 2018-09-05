import React from 'react';

export default function SourceTask(props) {
  const { task } = props;
  return (
    <div>
      <h4>{task.collection}</h4>
      <div>
        <h5>Cron rules</h5>
        <ul>
          <li>Copy: {task.copyCronRule}</li>
          <li>Copy missing: {task.copyMissingIdsCronRule}</li>
          <li>Remove: {task.removeCronRule}</li>
        </ul>
      </div>
    </div>
  );
}
