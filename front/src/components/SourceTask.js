import React from 'react';
import { parseExpression } from 'cron-parser';

import DateTime from './DateTime';

export default function SourceTask(props) {
  const { task } = props;

  let content;
  if (!task.enabled) {
    content = <div>This task is disabled</div>;
  } else if (!task.copyCronRule) {
    content = <div>This task has no copy cron rule</div>;
  } else {
    const cronRule = task.copyCronRule;
    const parsed = parseExpression(cronRule);
    content = (
      <div>
        Next copy <DateTime date={parsed.next().toISOString()} />
      </div>
    );
  }

  return (
    <div>
      <div className="font-bold text-lg mb-2">{task.collection}</div>
      {content}
    </div>
  );
}
