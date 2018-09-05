import React from 'react';

export default function AggregationTask(props) {
  const { task } = props;
  return (
    <div>
      <h4>{task.collection}</h4>
      <div>
        <h5>Sources</h5>
        <ul>
          {task.sources.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
