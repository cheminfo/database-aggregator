import React from 'react';
import { parseExpression } from 'cron-parser';

import DateTime from './DateTime';
import StatusSvg from './svg/StatusSvg';

export default function SourceTaskCron(props) {
  const { label, value, status } = props;
  if (!value) return null;

  const parsed = parseExpression(value);

  return (
    <li>
      <StatusSvg inline size="small" status={status} />
      &nbsp; &nbsp; {label}: <DateTime date={parsed.next().toISOString()} />
    </li>
  );
}
