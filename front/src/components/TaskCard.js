import React from 'react';
import classNames from 'classnames';
import StatusSvg from './svg/StatusSvg';

const statusTextMap = {
  null: 'This task has never been scheduled',
  error: 'Last execution of this task failed',
  queued: 'This task is currently queued',
  success: 'Last execution of this task succeeded'
};

export default function TaskCard(props) {
  const { enabled, status, children } = props;
  const opacity = classNames({ 'opacity-25': !enabled });
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-md m-auto px-6 py-4 mb-6 relative">
      <div className={opacity}>
        <div className="absolute pin-r pr-6" title={statusTextMap[status]}>
          <StatusSvg status={status} />
        </div>
        {children}
      </div>
    </div>
  );
}
