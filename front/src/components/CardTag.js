import React from 'react';

import classNames from 'classnames';

export default function CardTag(props) {
  const { value, onClick } = props;
  const className = classNames(
    'inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-mono',
    {
      'cursor-pointer': !!onClick
    }
  );
  return (
    <span className={className} onClick={onClick}>
      {value}
    </span>
  );
}
