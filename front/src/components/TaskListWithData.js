import React from 'react';
import Polling from './Polling';
import TaskList from './TaskList';

const TaskListWithData = () => {
  return (
    <Polling interval={10000} url="scheduler/tasks">
      {({ data, error }) => {
        return <TaskList tasks={data} error={error} />;
      }}
    </Polling>
  );
};

export default TaskListWithData;
