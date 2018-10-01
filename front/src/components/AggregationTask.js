import React from 'react';

import AggregationSources from './AggregationSources';

export default function AggregationTask(props) {
  const { task } = props;
  return (
    <div>
      <div className="font-bold text-lg mb-2">{task.collection}</div>
      <AggregationSources task={task} />
    </div>
  );
}
