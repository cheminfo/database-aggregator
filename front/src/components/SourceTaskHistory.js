import React from 'react';
import StatusSvg from './svg/StatusSvg';
import DateTime from './DateTime';
import Collapsible from './Collapsible';

export default function SourceTaskHistory({ history }) {
  return (
    <div className="container-xl">
      <table className="w-full text-left table-collapse">
        <thead>
          <tr>
            <TableHeader>Status</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Info</TableHeader>
          </tr>
        </thead>
        <tbody className="align-baseline">
          <tr>
            <TableCell className="w-8">
              <StatusSvg status="success" />
            </TableCell>
            <TableCell className="w-64">
              <DateTime date={new Date()} />
            </TableCell>
            <TableCell>
              <Collapsible title="abc">Test 123</Collapsible>
            </TableCell>
          </tr>
        </tbody>
      </table>
    </div>
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
