import React, { Component } from 'react';

import Dashboard from './Dashboard';

class App extends Component {
  render() {
    return (
      <div className="m-3">
        <header>
          <h1>Database aggregator</h1>
        </header>

        <Dashboard />
      </div>
    );
  }
}

export default App;
