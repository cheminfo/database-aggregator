import React from 'react';
import classNames from 'classnames';

export default function TaskCard(props) {
  const { enabled, children } = props;
  const opacity = classNames({ 'opacity-25': !enabled });
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-md m-auto px-6 py-4 mb-6 relative">
      <div className={opacity}>
        <div className="absolute pin-r pr-6">
          <svg
            className="fill-current text-red-light w-6 h-6"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" />
          </svg>
        </div>
        {children}
      </div>
    </div>
  );
}
