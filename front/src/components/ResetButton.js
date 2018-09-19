import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import Button from './Button';

export default class ResetButton extends Component {
  static propTypes = {
    resetDatabase: PropTypes.func.isRequired
  };

  state = {
    warning: false
  };

  showWarning = () => {
    this.setState({ warning: true });
  };

  removeWarning = () => {
    this.setState({ warning: false });
  };

  reset = () => {
    this.props.resetDatabase();
    this.removeWarning();
  };

  render() {
    let portal = null;
    if (this.state.warning) {
      portal = createPortal(
        <ModalConfirm confirm={this.reset} cancel={this.removeWarning} />,
        document.getElementById('modal-root')
      );
    }
    return (
      <div>
        <Button
          color="red"
          onClick={this.showWarning}
          description="Reset database"
        />
        {portal}
      </div>
    );
  }
}

function ModalConfirm({ confirm, cancel }) {
  return (
    <div className="fixed pin-t pin-l w-screen h-screen bg-smoke flex items-center justify-center">
      <div className="bg-grey-darker text-white p-4 rounded">
        <p className="font-bold mb-3">Are you sure?</p>
        <p className="mb-2">
          This action will completely remove the collection.
        </p>
        <Button description="Yes, reset" color="red" onClick={confirm} />
        <Button description="Cancel" color="grey" onClick={cancel} />
      </div>
    </div>
  );
}
