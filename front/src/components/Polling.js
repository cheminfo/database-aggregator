import { useState, useEffect } from 'react';
import { axios, getErrorMessage } from '../axios';

export function Polling(props) {
  const [pollingState, setPollingState] = useState({
    loading: false,
    data: null,
    error: null
  });

  useEffect(
    () => {
      fetch();
    },
    [props.interval, props.url]
  );

  useEffect(
    () => {
      let timeout;
      function fetchWithTimeout() {
        if (!props.interval || props.interval <= 0) return;
        timeout = window.setTimeout(async () => {
          await fetch();
        }, props.interval);
      }
      fetchWithTimeout();
      return () => {
        window.clearTimeout(timeout);
      };
    },
    [props.url, pollingState.data, props.interval]
  );

  function fetch() {
    setPollingState({
      ...pollingState,
      loading: true
    });
    return axios
      .get(props.url)
      .then((response) => {
        setPollingState({ data: response.data, error: null, loading: false });
      })
      .catch((e) => {
        const error = getErrorMessage(e);
        setPollingState({ data: null, error, loading: false });
      });
  }

  return props.children({
    data: pollingState.data || null,
    error: pollingState.error || null,
    loading: pollingState.loading
  });
}

export default Polling;
