import React, { Component } from 'react';
import moment from 'moment';
import { axios, getErrorMessage } from '../axios';
import notification from '../notification';

const HOURS_12 = 12 * 60 * 60 * 1000;

export default class TaskDetailProvider extends Component {
  constructor(props) {
    super(props);

    const today = moment()
      .hours(12)
      .minutes(0)
      .seconds(0);
    this.state = {
      loadingHistory: false,
      history: [],
      startDate: today,
      endDate: today
    };
  }

  componentDidMount() {
    this.fetchHistory(this.state.startDate, this.state.endDate);
  }

  getUrl(path = '', prefix = 'scheduler') {
    const {
      type,
      match: { params }
    } = this.props;
    return `/${prefix}/${type}/${params.task}/${path}`;
  }

  triggerTask = (type) => {
    const params = this.props.match.params;
    const options = {};
    if (type) {
      options.params = {
        type
      };
    }
    axios
      .post(this.getUrl('trigger'), undefined, options)
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
  };

  fetchHistory(startDate, endDate) {
    this.setState({ loadingHistory: true });
    axios
      .get(this.getUrl('history'), {
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
        this.setState({ loadingHistory: false, history: response.data });
      });
  }

  resetDatabase = () => {
    const params = this.props.match.params;
    axios.delete(this.getUrl('', 'db')).then(
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
  };

  onDatesChange(event) {
    this.setState({
      startDate: event.startDate,
      endDate: event.endDate
    });
    if (event.startDate && event.endDate) {
      this.fetchHistory(event.startDate, event.endDate);
    }
  }

  render() {
    const Component = this.props.component;
    return (
      <Component
        onDatesChange={this.onDatesChange.bind(this)}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        history={this.state.history}
        loadingHistory={this.state.historyLoading}
        name={this.props.match.params.task}
        triggerTask={this.triggerTask}
        resetDatabase={this.resetDatabase}
      />
    );
  }
}
