import React from 'react';
import { withRouter } from 'react-router-dom';

import CardTag from './CardTag';

function AggregationSources(props) {
  const { task, history, enableClick } = props;
  return (
    <div>
      <span className="font-bold mr-3">Sources:</span>
      {task.sources.map((source) => (
        <CardTag
          key={source}
          value={source}
          onClick={
            enableClick ? () => history.push(`/tasks/sources/${source}`) : null
          }
        />
      ))}
    </div>
  );
}

export default withRouter(AggregationSources);
