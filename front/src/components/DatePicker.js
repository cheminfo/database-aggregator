import React, { Component } from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';

export default class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null
    };
  }

  onFocusChange = focusedInput => {
    this.setState({ focusedInput });
  };
  render() {
    return (
      <DateRangePicker
        startDateId="startDate"
        endDateId="endDate"
        startDate={this.props.startDate}
        endDate={this.props.endDate}
        focusedInput={this.state.focusedInput}
        isOutsideRange={isOutsideRange}
        onDatesChange={this.props.onDatesChange}
        onFocusChange={this.onFocusChange}
        minimumNights={0}
        displayFormat="DD/MM/YYYY"
      />
    );
  }
}

function isOutsideRange(date) {
  const today = moment();
  return date.isAfter(today);
}
