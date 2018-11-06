import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import TaskListWithData from './TaskListWithData';
import TaskDetails from './TaskDetails';
import AggregationTaskData from './AggregationTaskData';
import SourceTaskData from './SourceTaskData';
import Header from './Header';
import NoMatch from './NoMatch';
import NotificationCenter from './NotificationCenter';
import TaskDetailProvider from './TaskDetailProvider';

class App extends Component {
  render() {
    return (
      <div>
        <NotificationCenter />
        <Header />
        <div className="w-full max-w-4xl m-auto px-4 pt-4">
          <Switch>
            <Route exact path="/" component={TaskListWithData} />
            <Route
              exact
              path="/tasks/sources/:task"
              render={(props) => (
                <TaskDetailProvider
                  {...props}
                  type="source"
                  taskDataComponent={SourceTaskData}
                  component={TaskDetails}
                  includeType
                />
              )}
            />
            <Route
              exact
              path="/tasks/aggregations/:task"
              render={(props) => (
                <TaskDetailProvider
                  {...props}
                  type="aggregation"
                  taskDataComponent={AggregationTaskData}
                  component={TaskDetails}
                  includeType={false}
                />
              )}
            />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
