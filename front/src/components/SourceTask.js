import React from 'react';

export default function SourceTask(props) {
  const { task } = props;
  return (
    <div>
      <div className="font-bold text-xl mb-2">{task.collection}</div>
      <div>
        <div className="font-bold mb-2">Cron rules</div>
        <ul>
          <li>Copy: {task.copyCronRule}</li>
          <li>Copy missing: {task.copyMissingIdsCronRule}</li>
          <li>Remove: {task.removeCronRule}</li>
        </ul>
      </div>
    </div>
  );
}
