import React, { Component } from 'react';
import moment from 'moment';
import { axios } from '../axios';

const HOURS_12 = 12 * 60 * 60 * 1000;

export default class TaskDetailProvider extends Component {
  constructor(props) {
    super(props);

    const today = moment()
      .hours(12)
      .minutes(0)
      .seconds(0);
    this.state = {
      task: null,
      loadingHistory: false,
      history: [],
      startDate: today,
      endDate: today
    };
  }

  componentDidMount() {
    this.fetchInfo();
    this.fetchHistory(this.state.startDate, this.state.endDate);
  }

  getUrl(path = '') {
    const {
      type,
      match: { params }
    } = this.props;
    return `/scheduler/${type}/${params.task}/${path}`;
  }

  triggerTask = (type) => {
    const options = {};
    if (type) {
      options.params = {
        type
      };
    }
    axios.post(this.getUrl('trigger'), undefined, options);
  };

  fetchInfo() {
    axios.get(this.getUrl()).then((response) => {
      this.setState({ task: response.data });
    });
  }

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
          elem.state.sort((a, b) => b.date.localeCompare(a.date));
        }
        this.setState({ loadingHistory: false, history: response.data });
      });
  }

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
        task={this.state.task}
        onDatesChange={this.onDatesChange.bind(this)}
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        history={this.state.history}
        loadingHistory={this.state.historyLoading}
        name={this.props.match.params.task}
        triggerTask={this.triggerTask}
      />
    );
  }
}
