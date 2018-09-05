import React from 'react';

import CardTag from './CardTag';

export default function AggregationTask(props) {
  const { task } = props;
  return (
    <div>
      <div className="font-bold text-xl mb-2">{task.collection}</div>
      <div>
        <span className="font-bold mr-3">Sources:</span>
        {task.sources.map((source) => (
          <CardTag key={source} value={source} />
        ))}
      </div>
    </div>
  );
}
