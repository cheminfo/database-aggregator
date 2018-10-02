import React from 'react';
import classNames from 'classnames';

import StatusSvg from './svg/StatusSvg';
import DateTime from './DateTime';
import Collapsible from './Collapsible';

const taskType = /^source_(copy_missing_ids|copy|remove|)_/;

export default function TaskHistory({ history, includeType = false }) {
  return history.length > 0 ? (
    <table className="w-full text-left table-collapse table-fixed">
      <thead>
        <tr>
          <TableHeader className="w-16">Status</TableHeader>
          {includeType ? (
            <TableHeader className="w-32">Type</TableHeader>
          ) : null}
          <TableHeader className="w-32">Date</TableHeader>
          <TableHeader>Info</TableHeader>
        </tr>
      </thead>
      <tbody className="align-baseline">
        {history.map((historyItem) => {
          const m = taskType.exec(historyItem.taskId);
          const type = m && m[1];
          const last = historyItem.state[0];
          return (
            <tr key={historyItem.pid}>
              <TableCell className="w-16">
                <StatusSvg status={last.status} message={last.reason} />
              </TableCell>
              {includeType ? (
                <TableCell className="w-32">{type}</TableCell>
              ) : null}
              <TableCell className="w-32">
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
    'No history for the selected time period'
  );
}

function TableHeader(props) {
  const className = classNames(
    'text-sm font-semibold text-grey-darker p-2 bg-grey-lightest',
    props.className
  );
  return <th className={className}>{props.children}</th>;
}

function TableCell(props) {
  const className = classNames(
    'p-2 border-t border-grey-light text-xs whitespace-no-wrap',
    props.className
  );
  return <td className={className}>{props.children}</td>;
}
