import React, { Component } from 'react';
import ChevronRight from './svg/ChevronRight';
import ChevronDown from './svg/ChevronDown';

export default class Collapsible extends Component {
  state = { collapsed: true };
  toggleCollapse = () => {
    this.setState((previousState) => ({
      collapsed: !previousState.collapsed
    }));
  };
  render() {
    const ChevronComponent = this.state.collapsed ? ChevronRight : ChevronDown;
    return (
      <div>
        <div className="flex items-center">
          <ChevronComponent
            onClick={this.toggleCollapse}
            className="h-5 w-5 inline-block cursor-pointer"
          />
          <div>{this.props.title}</div>
        </div>
        <div>{!this.state.collapsed && <pre>{this.props.children}</pre>}</div>
      </div>
    );
  }
}
