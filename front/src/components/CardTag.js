import React from 'react';

export default function CardTag(props) {
  const { value } = props;
  return (
    <span className="inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-mono">
      {value}
    </span>
  );
}
