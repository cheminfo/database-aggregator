import React, { Component } from 'react';

import { axios } from '../axios';

export default class DashboardContent extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      tasks: []
    };
  }

  componentDidMount() {
    axios.get('scheduler/tasks').then((res) => {
      this.setState({ tasks: res.data });
    });
  }

  render() {
    const { tasks } = this.state;
    if (tasks.length === 0) {
      return <p>No tasks</p>;
    } else {
      return (
        <div>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>{task.name}</li>
            ))}
          </ul>
        </div>
      );
    }
  }
}
