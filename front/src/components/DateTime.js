import React, { Component } from 'react';
import moment from 'moment';

export default class DateTime extends Component {
  state = { fromNow: this.fromNow() };
  fromNow() {
    return moment(this.props.date).fromNow();
  }
  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        fromNow: this.fromNow()
      });
    }, 60000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return <span title={this.props.date}>{this.state.fromNow}</span>;
  }
}
