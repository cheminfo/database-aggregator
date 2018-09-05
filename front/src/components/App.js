import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import TaskList from './TaskList';
import Header from './Header';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="w-full max-w-3xl m-auto px-4 pt-4">
          <Route exact path="/" component={TaskList} />
        </div>
      </div>
    );
  }
}

export default App;
