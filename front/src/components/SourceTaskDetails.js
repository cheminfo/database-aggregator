import React, { Component } from 'react';

import { axios } from '../axios';

import SourceTaskHistory from './SourceTaskHistory';

export default class SourceTaskDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      history: null
    };
  }

  componentDidMount() {
    const {
      match: { params }
    } = this.props;
    axios
      .get('/scheduler/source/' + params.task + '/history')
      .then((response) => {
        const history = response.data;
        for (const elem of history) {
          elem.state.sort((a, b) => b.date.localeCompare(a.date));
        }
        this.setState({ loading: false, history: response.data });
      });
  }

  render() {
    if (this.state.loading) {
      return 'Loading...';
    }
    return (
      <div className="flex">
        <div className="flex-1">Other</div>
        <div className="flex-1">
          <SourceTaskHistory history={this.state.history} />
        </div>
      </div>
    );
  }
}
