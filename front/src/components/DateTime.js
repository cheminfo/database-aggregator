import React from 'react';
import moment from 'moment';

export default function({ date }) {
  return <span title={date}>{moment(date).fromNow()}</span>;
}
