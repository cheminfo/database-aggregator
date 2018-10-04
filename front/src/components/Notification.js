import React from 'react';
import classNames from 'classnames';

import SvgClose from './svg/Close';

const Notification = ({ id, title, description, type, onClose }) => {
  const success = type === 'success';
  const error = type === 'error';
  const info = type === 'info';
  const wrapperClassNames = classNames({
    'bg-green-lightest': success,
    'bg-blue-lightest': info,
    'bg-red-lightest': error,
    'border-green-light': success,
    'border-red-light': error,
    'border-blue-light': info
  });

  const headerClassNames = classNames({
    'text-green-light': success,
    'text-red-light': error,
    'text-blue-light': info
  });
  return (
    <div className={`w-64 p-2 border border-t-4 m-4 ${wrapperClassNames}`}>
      <SvgClose
        className="w-4 h-4 fill-current inline-block cursor-pointer float-right"
        onClick={() => onClose(id)}
      />
      <h3 className={headerClassNames}>{title}</h3>
      <div>{description}</div>
    </div>
  );
};

Notification.defaultProps = {
  type: 'info'
};

export default Notification;
