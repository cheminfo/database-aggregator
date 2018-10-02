import { Component } from 'react';
import { axios } from '../axios';

export class Polling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: null,
      error: null
    };
  }

  async componentDidMount() {
    await this.fetch();
    await this.fetchWithTimeout();
  }

  fetch() {
    this.setState({
      loading: true
    });
    return axios
      .get(this.props.url)
      .then((response) => {
        this.setState({ data: response.data, error: null, loading: false });
      })
      .catch((e) => {
        let error = e.message;
        if (e.response) {
          if (typeof e.response.data === 'string') {
            error = e.response.data;
          } else if (
            typeof e.response.data === 'object' &&
            e.response.data !== null
          ) {
            error = e.response.data.error;
          }
        }
        this.setState({ data: null, error, loading: false });
      });
  }

  fetchWithTimeout() {
    if (this.props.interval < 0) return;
    this.timeout = setTimeout(async () => {
      await this.fetch();
      this.fetchWithTimeout();
    }, this.props.interval);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  render() {
    return this.props.children({
      data: this.state.data || null,
      error: this.state.error || null,
      loading: this.state.loading
    });
  }
}

export default Polling;
