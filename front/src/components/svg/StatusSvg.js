import React from 'react';

const statusColorMap = {
  null: 'text-grey-light',
  error: 'text-red-light',
  queued: 'text-orange-light',
  running: 'text-blue-light',
  success: 'text-green-light'
};

const statusTextMap = {
  null: 'This task has never been scheduled',
  error: 'Last execution of this task failed',
  queued: 'This task is currently queued',
  running: 'This task is running',
  success: 'Last execution of this task succeeded'
};

export default function({ status }) {
  return (
    <div title={statusTextMap[status]}>
      <svg
        className={`fill-current ${statusColorMap[status]} w-6 h-6`}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" />
      </svg>
    </div>
  );
}
