import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import TaskList from './TaskList';
import Header from './Header';
import NoMatch from './NoMatch';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="w-full max-w-3xl m-auto px-4 pt-4">
          <Switch>
            <Route exact path="/" component={TaskList} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
