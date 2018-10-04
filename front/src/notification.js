import { EventEmitter } from 'events';

class Notification extends EventEmitter {
  addNotification(notif) {
    this.emit('new', notif);
  }
}

const notification = new Notification();
export default notification;
