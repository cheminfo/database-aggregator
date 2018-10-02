import React from 'react';
import Polling from './Polling';
import TaskList from './TaskList';

const TaskListWithData = () => {
  return (
    <Polling interval={10000} url="scheduler/tasks">
      {({ data, error }) => {
        if (data) {
          data.sources.sort(sortTasks);
        }
        return <TaskList tasks={data} error={error} />;
      }}
    </Polling>
  );
};

export default TaskListWithData;

const statusScore = {
  running: 2,
  queued: 1,
  none: 0
};

function sortTasks(a, b) {
  if (a.enabled !== b.enabled) {
    return a.enabled ? -1 : 1;
  }
  const stateCompare = compareState(a.state, b.state);
  if (stateCompare !== 0) return stateCompare;
  return a.collection.localeCompare(b.collection);
}

function compareStatus(a, b) {
  const statusA = a ? a.status : 'none';
  const statusB = b ? b.status : 'none';
  return (statusScore[statusB] || 0) - (statusScore[statusA] || 0);
}

function compareState(stateA, stateB) {
  if (compareStatus(stateA, stateB) === 0) {
    const dateA = stateA ? stateA.date : '';
    const dateB = stateB ? stateB.date : '';
    return dateB.localeCompare(dateA);
  } else {
    return compareStatus(stateA, stateB);
  }
}
