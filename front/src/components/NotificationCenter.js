import React, { Component } from 'react';

import Notification from './Notification';

import notification from '../notification';

export default class NotificationCenter extends Component {
  componentDidMount() {
    notification.on('new', (notif) => {
      const newNotifications = this.state.notifications.slice();
      this.counter++;
      const id = this.counter;
      notif = {
        ...notif,
        id,
        key: id
      };
      newNotifications.unshift(notif);
      this.setState({
        notifications: newNotifications
      });
      if (notif.timeout) {
        setTimeout(() => {
          this.onClose(id);
        }, notif.timeout);
      }
    });
  }

  onClose = (id) => {
    const idx = this.state.notifications.findIndex((notif) => notif.key === id);
    console.log(id);
    if (idx >= 0) {
      const newNotifications = this.state.notifications.slice();
      newNotifications.splice(idx, 1);
      this.setState({
        notifications: newNotifications
      });
    }
  };
  componentWillUnmount() {}
  state = { notifications: [] };
  counter = 0;
  render() {
    return (
      <div className="absolute pin-r pin-t">
        {this.state.notifications.map((notif) => (
          <Notification {...notif} id={notif.id} onClose={this.onClose} />
        ))}
      </div>
    );
  }
}
