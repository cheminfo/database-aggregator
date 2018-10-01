import React from 'react';
import Polling from './Polling';
import TaskList from './TaskList';

const TaskListWithData = () => {
  return (
    <Polling interval={2000} url="scheduler/tasks">
      {({ data }) => {
        console.log(data);
        if (data === null) return null;
        return <TaskList tasks={data} />;
      }}
    </Polling>
  );
};

export default TaskListWithData;
