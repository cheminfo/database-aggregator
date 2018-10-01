import React from 'react';
import classNames from 'classnames';

const statusColorMap = {
  null: 'text-grey-light',
  error: 'text-red-light',
  queued: 'text-orange-light',
  running: 'text-blue-light',
  success: 'text-green-light',
  interrupted: 'text-grey-light'
};

const statusTextMap = {
  null: 'The task has never been scheduled',
  error: 'The task failed',
  queued: 'The task is queued',
  running: 'The task is running',
  success: 'The task succeeded',
  interrupted: 'The task has been interrupted'
};

export default function({ status, message, inline, size }) {
  if (status === undefined) return null;
  const svgClassNames = classNames({
    'w-6': size !== 'small',
    'h-6': size !== 'small',
    'w-4': size === 'small',
    'h-4': size === 'small',
    'fill-current': true,
    [statusColorMap[status]]: true
  });

  return (
    <div
      className={classNames({ inline })}
      title={
        message
          ? `${statusTextMap[status]}: ${message}`
          : statusTextMap[status] || `Unknown status: ${status}`
      }
    >
      <svg className={svgClassNames} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" />
      </svg>
    </div>
  );
}
