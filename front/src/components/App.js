import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import TaskListWithData from './TaskListWithData';
import AggregationTaskDetails from './AggregationTaskDetails';
import SourceTaskDetails from './SourceTaskDetails';
import Header from './Header';
import NoMatch from './NoMatch';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="w-full max-w-3xl m-auto px-4 pt-4">
          <Switch>
            <Route exact path="/" component={TaskListWithData} />
            <Route
              exact
              path="/tasks/sources/:task"
              component={SourceTaskDetails}
            />
            <Route
              exact
              path="/tasks/aggregations/:task"
              component={AggregationTaskDetails}
            />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
