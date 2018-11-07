import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { axios, getErrorMessage } from '../axios';
import notification from '../notification';

const HOURS_12 = 12 * 60 * 60 * 1000;

// Provides a task's history and trigger functions to components downstream
export default function TaskDetailProvider(props) {
  const [history, setHistory] = useState({
    loading: false,
    data: []
  });

  const [range, setRange] = useState(() => {
    const today = moment()
      .hours(12)
      .minutes(0)
      .seconds(0);

    return {
      startDate: today,
      endDate: today
    };
  });

  useEffect(
    () => {
      fetchHistory(range.startDate, range.endDate);
    },
    [range, props.type]
  );

  function getUrl(path = '', prefix = 'scheduler') {
    const {
      type,
      match: { params }
    } = props;
    return `/${prefix}/${type}/${params.task}/${path}`;
  }

  function triggerTask(type) {
    const params = props.match.params;
    const options = {};
    if (type) {
      options.params = {
        type
      };
    }
    axios
      .post(getUrl('trigger'), undefined, options)
      .then(() => {
        notification.addNotification({
          title: `Trigger ${type} ${params.task}`,
          description: `Trigger ${type} was successful`,
          type: 'success',
          timeout: 5000
        });
      })
      .catch((e) => {
        let error = getErrorMessage(e);
        notification.addNotification({
          title: `Trigger ${type} ${params.task}`,
          description: `error: ${error}`,
          type: 'error'
        });
      });
  }

  function fetchHistory(startDate = range.startDate, endDate = range.endDate) {
    setHistory({ loading: true, data: [] });
    axios
      .get(getUrl('history'), {
        params: {
          from: +startDate - HOURS_12,
          to: +endDate + HOURS_12
        }
      })
      .then((response) => {
        const history = response.data;
        for (const elem of history) {
          elem.state.sort((a, b) => {
            const byDate = b.date.localeCompare(a.date);
            if (byDate !== 0) {
              return byDate;
            } else {
              return b._id.localeCompare(a._id);
            }
          });
        }
        setHistory({
          loading: false,
          data: response.data,
          fetchTime: new Date()
        });
      })
      .catch((e) => {
        const errorMessage = getErrorMessage(e);
        setHistory({
          loading: false,
          data: null,
          error: errorMessage,
          fetchTime: new Date()
        });
      });
  }

  function resetDatabase() {
    const params = props.match.params;
    axios.delete(getUrl('', 'db')).then(
      () => {
        notification.addNotification({
          title: `Reset ${params.task}`,
          description: 'Database successfully reset',
          type: 'success',
          timeout: 5000
        });
      },
      (e) => {
        let error = getErrorMessage(e);
        notification.addNotification({
          title: `Reset ${params.task}`,
          description: `error: ${error}`,
          type: 'error'
        });
      }
    );
  }

  function onDatesChange(event) {
    setRange({
      startDate: event.startDate,
      endDate: event.endDate
    });
  }

  const { component: Component, ...otherProps } = props;
  return (
    <Component
      {...otherProps}
      onDatesChange={onDatesChange}
      startDate={range.startDate}
      endDate={range.endDate}
      history={history.data}
      historyError={history.error}
      loadingHistory={history.loading}
      refreshHistory={() => fetchHistory()}
      fetchTime={history.fetchTime}
      name={props.match.params.task}
      triggerTask={triggerTask}
      resetDatabase={resetDatabase}
    />
  );
}
