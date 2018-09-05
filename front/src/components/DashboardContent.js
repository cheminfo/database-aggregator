import React, { Component } from 'react';

import { axios } from '../axios';

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
        <div>
          <h3>Aggregations</h3>
          <ul>
            {tasks.aggregations.map((task) => (
              <li key={task.collection}>{task.collection}</li>
            ))}
          </ul>
          <h3>Sources</h3>
          <ul>
            {tasks.sources.map((task) => (
              <li key={task.collection}>{task.collection}</li>
            ))}
          </ul>
        </div>
      );
    }
  }
}
