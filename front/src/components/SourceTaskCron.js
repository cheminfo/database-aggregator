import React from 'react';
import { parseExpression } from 'cron-parser';

import DateTime from './DateTime';

export default function SourceTaskCron(props) {
  const { label, value } = props;
  if (!value) return null;

  const parsed = parseExpression(value);

  return (
    <li>
      {label}: <DateTime date={parsed.next().toString()} />
    </li>
  );
}
