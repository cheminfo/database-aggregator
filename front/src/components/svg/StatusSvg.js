import React from 'react';

const statusColorMap = {
  null: 'text-grey-light',
  error: 'text-red-light',
  queued: 'text-orange-light',
  success: 'text-green-light'
};

export default function({ status }) {
  return (
    <svg
      className={`fill-current ${statusColorMap[status]} w-6 h-6`}
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" />
    </svg>
  );
}
