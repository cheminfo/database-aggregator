import React, { Component } from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
      startDate: props.initialStartDate,
      endDate: props.initialEndDate
    };
  }

  onDatesChange = (event) => {
    const { startDate, endDate } = event;
    this.setState({
      startDate,
      endDate
    });
    if (this.props.onDatesChange) {
      this.props.onDatesChange(event);
    }
  };
  onFocusChange = (focusedInput) => {
    this.setState({ focusedInput });
  };
  render() {
    return (
      <DateRangePicker
        startDateId="startDate"
        endDateId="endDate"
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        focusedInput={this.state.focusedInput}
        isOutsideRange={isOutsideRange}
        onDatesChange={this.onDatesChange}
        onFocusChange={this.onFocusChange}
      />
    );
  }
}

function isOutsideRange(date) {
  const today = moment();
  return date.isAfter(today);
}
