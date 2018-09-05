import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import TaskList from './TaskList';
import Header from './Header';

class App extends Component {
  render() {
    return (
      <div className="m-3">
        <Header />
        <Route exact path="/" component={TaskList} />
      </div>
    );
  }
}

export default App;
