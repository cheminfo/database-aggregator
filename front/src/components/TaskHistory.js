import React from 'react';

import StatusSvg from './svg/StatusSvg';
import DateTime from './DateTime';
import Collapsible from './Collapsible';

const taskType = /^source_(.+)_[^_]+$/;

export default function TaskHistory({ history, includeType = false }) {
  return history.length > 0 ? (
    <table className="w-full text-left table-collapse">
      <thead>
        <tr>
          <TableHeader>Status</TableHeader>
          {includeType ? <TableHeader>Type</TableHeader> : null}
          <TableHeader>Date</TableHeader>
          <TableHeader>Info</TableHeader>
        </tr>
      </thead>
      <tbody className="align-baseline">
        {history.map(historyItem => {
          const m = taskType.exec(historyItem.taskId);
          const type = m && m[1];
          const last = historyItem.state[0];
          return (
            <tr key={historyItem.pid}>
              <TableCell className="w-8">
                <StatusSvg status={last.status} />
              </TableCell>
              {includeType ? (
                <TableCell className="w-8">{type}</TableCell>
              ) : null}
              <TableCell className="w-64">
                <DateTime date={last.date} />
              </TableCell>
              <TableCell>
                {last.stdout ? (
                  <Collapsible title="stdout">{last.stdout}</Collapsible>
                ) : null}
                {last.stderr ? (
                  <Collapsible title="stderr">{last.stderr}</Collapsible>
                ) : null}
                {!last.stdout &&
                  !last.stderr && (
                    <span className="font-italic text-grey">N/A</span>
                  )}
              </TableCell>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    'No tasks found'
  );
}

function TableHeader(props) {
  return (
    <th className="text-sm font-semibold text-grey-darker p-2 bg-grey-lightest">
      {props.children}
    </th>
  );
}

function TableCell(props) {
  return (
    <td
      className={`p-2 border-t border-grey-light text-xs whitespace-no-wrap ${props.className ||
        ''}`}
    >
      {props.children}
    </td>
  );
}
