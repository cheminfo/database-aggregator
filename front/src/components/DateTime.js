import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';

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
    }, 10000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const spanClassNames = classNames({
      'text-grey-dark': this.props.light
    });
    return (
      <span className={spanClassNames} title={this.props.date}>
        {`${this.props.description} ${this.state.fromNow}`}
      </span>
    );
  }
}

DateTime.defaultProps = {
  description: ''
};
