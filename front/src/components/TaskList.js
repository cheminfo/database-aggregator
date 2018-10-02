import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AggregationTask from './AggregationTask';
import SourceTask from './SourceTask';
import TaskCard from './TaskCard';
import Error from './Error';

class TaskList extends Component {
  navToAggregation = (collection) => {
    this.props.history.push(`/tasks/aggregations/${collection}`);
  };

  navToSource = (collection) => {
    this.props.history.push(`/tasks/sources/${collection}`);
  };

  render() {
    const { tasks, error } = this.props;
    if (error) {
      return (
        <section>
          <h2 className="text-center mb-4">Task list</h2>
          <Error message={error} />
        </section>
      );
    }
    if (tasks === null) {
      return <p>Loading</p>;
    } else {
      return (
        <section>
          <h2 className="text-center mb-4">Task list</h2>
          <div className="flex w-full">
            <div className="flex-1">
              <div className="text-center text-xl font-bold mb-4">Sources</div>
              <div className="flex flex-wrap">
                {tasks.sources.map((task) => (
                  <div className="w-full xl:w-1/2 px-4">
                    <TaskCard
                      key={task.collection}
                      enabled={task.enabled}
                      state={task.copyState}
                      onClick={() => this.navToSource(task.collection)}
                    >
                      <SourceTask task={task} />
                    </TaskCard>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-center text-xl font-bold mb-4">
                Aggregations
              </div>
              <div>
                {tasks.aggregations.map((task) => (
                  <TaskCard
                    key={task.collection}
                    enabled={task.enabled}
                    state={task.state}
                    onClick={() => this.navToAggregation(task.collection)}
                  >
                    <AggregationTask task={task} />
                  </TaskCard>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }
  }
}

export default withRouter(TaskList);
