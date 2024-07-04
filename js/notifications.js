class NotificationManager {
  constructor() {
    this.notifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
  }

  addNotification(notification) {
    this.notifications.push({ ...notification, id: Date.now() });
    this.saveNotifications();
  }

  getNotifications(userId) {
    return this.notifications.filter(
      (notification) => notification.userId === userId
    );
  }

  markAsRead(id) {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  clearAllNotifications(userId) {
    this.notifications = this.notifications.filter((n) => n.userId !== userId);
    this.saveNotifications();
  }

  saveNotifications() {
    localStorage.setItem("notifications", JSON.stringify(this.notifications));
  }

  addNewEventNotification(eventName, userId) {
    this.addNotification({
      userId,
      message: `New event "${eventName}" has been created.`,
      read: false,
    });
  }

  addRSVPNotification(eventName, status, userId) {
    this.addNotification({
      userId,
      message: `You have RSVP'd ${status} to "${eventName}".`,
      read: false,
    });
  }

  addEventChangeNotification(eventName, changes, userId) {
    let message;
    if (changes.length === 1) {
      message = `The ${changes[0]} for "${eventName}" has changed.`;
    } else if (changes.length > 1) {
      const lastChange = changes.pop();
      message = `The ${changes.join(
        ", "
      )} and ${lastChange} for "${eventName}" have changed.`;
    }
    this.addNotification({
      userId,
      message: message,
      read: false,
    });
  }
}

const notificationManager = new NotificationManager();
