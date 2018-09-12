import React, { Component } from 'react';
import moment from 'moment';
import { axios } from '../axios';

import SourceTaskHistory from './SourceTaskHistory';
import DatePicker from './DatePicker';

const HOURS_12 = 12 * 60 * 60 * 1000;

export default class SourceTaskDetails extends Component {
  constructor(props) {
    super(props);

    const today = moment()
      .hours(12)
      .minutes(0)
      .seconds(0);
    this.state = {
      loading: true,
      history: null,
      startDate: today,
      endDate: today
    };
  }

  componentDidMount() {
    this.fetchHistory(this.state.startDate, this.state.endDate);
  }

  fetchHistory(startDate, endDate) {
    const {
      match: { params }
    } = this.props;
    let url = '/scheduler/source/' + params.task + '/history';
    this.setState({ loading: true });
    axios
      .get(url, {
        params: {
          from: +startDate - HOURS_12,
          to: +endDate + HOURS_12
        }
      })
      .then(response => {
        const history = response.data;
        for (const elem of history) {
          elem.state.sort((a, b) => b.date.localeCompare(a.date));
        }
        this.setState({ loading: false, history: response.data });
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
    if (this.state.loading) {
      return 'Loading...';
    }
    return (
      <div className="flex">
        <div className="flex-1">Other</div>
        <div className="flex-1">
          <div className="mb-4 mx-2">
            <DatePicker
              onDatesChange={this.onDatesChange.bind(this)}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
            />
          </div>

          <SourceTaskHistory history={this.state.history} />
        </div>
      </div>
    );
  }
}
