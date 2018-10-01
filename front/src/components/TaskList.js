import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AggregationTask from './AggregationTask';
import SourceTask from './SourceTask';
import TaskCard from './TaskCard';

class TaskList extends Component {
  navToAggregation = (collection) => {
    this.props.history.push(`/tasks/aggregations/${collection}`);
  };

  navToSource = (collection) => {
    this.props.history.push(`/tasks/sources/${collection}`);
  };

  render() {
    const { tasks } = this.props;
    if (tasks === null) {
      return <p>Loading</p>;
    } else {
      return (
        <section>
          <h2 className="text-center mb-10">Task list</h2>
          <div className="flex w-full">
            <div className="flex-1">
              <div className="text-center text-2xl font-bold mb-6">Sources</div>
              <div>
                {tasks.sources.map((task) => (
                  <div
                    key={task.collection}
                    className="cursor-pointer"
                    onClick={() => this.navToSource(task.collection)}
                  >
                    <TaskCard
                      enabled={task.enabled}
                      status={task.status}
                      statusMessage={task.reason}
                    >
                      <SourceTask task={task} />
                    </TaskCard>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-center text-2xl font-bold mb-6">
                Aggregations
              </div>
              <div>
                {tasks.aggregations.map((task) => (
                  <div
                    key={task.collection}
                    className="cursor-pointer"
                    onClick={() => this.navToAggregation(task.collection)}
                  >
                    <TaskCard
                      enabled={task.enabled}
                      status={task.status}
                      statusMessage={task.reason}
                    >
                      <AggregationTask task={task} />
                    </TaskCard>
                  </div>
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
