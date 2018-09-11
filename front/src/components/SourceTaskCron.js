import React from 'react';

import { parseExpression } from 'cron-parser';

export default function SourceTaskCron(props) {
  const { label, value } = props;
  if (!value) return null;

  const parsed = parseExpression(value);

  return (
    <li>
      {label}: {parsed.next().toString()}
    </li>
  );
}
