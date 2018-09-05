import React from 'react';

export default function AggregationTask(props) {
  const { task } = props;
  return (
    <div>
      <div className="font-bold text-xl mb-2">{task.collection}</div>
      <div>
        <div className="font-bold mb-2">Sources</div>
        <ul>
          {task.sources.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
