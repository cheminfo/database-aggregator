import React, { Component } from 'react';

import { axios } from '../axios';

import AggregationTask from './AggregationTask';
import SourceTask from './SourceTask';

export default class DashboardContent extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      tasks: null
    };
  }

  componentDidMount() {
    axios.get('scheduler/tasks').then((res) => {
      this.setState({ tasks: res.data });
    });
  }

  render() {
    const { tasks } = this.state;
    if (tasks === null) {
      return <p>Loading</p>;
    } else {
      return (
        <section>
          <h2>Task list</h2>
          <h3>Aggregations</h3>
          <div>
            {tasks.aggregations.map((task) => (
              <AggregationTask key={task.collection} task={task} />
            ))}
          </div>
          <h3>Sources</h3>
          <div>
            {tasks.sources.map((task) => (
              <SourceTask key={task.collection} task={task} />
            ))}
          </div>
        </section>
      );
    }
  }
}
