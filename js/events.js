class EventManager {
  constructor() {
    this.events = JSON.parse(localStorage.getItem("events")) || [];
  }

  createEvent(event) {
    this.events.push(event);
    this.saveEvents();
  }

  getEvents(userId) {
    return this.events.filter((event) => event.creator === userId);
  }

  getUpcomingEvents(userId) {
    const now = new Date();
    return this.events
      .filter((event) => event.creator === userId && new Date(event.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  getEvent(id) {
    return this.events.find((event) => event.id === id);
  }

  updateEvent(updatedEvent) {
    const index = this.events.findIndex(
      (event) => event.id === updatedEvent.id
    );
    if (index !== -1) {
      const oldEvent = this.events[index];
      const changes = this.getEventChanges(oldEvent, updatedEvent);
      this.events[index] = updatedEvent;
      this.saveEvents();
      return changes;
    }
    return [];
  }

  getEventChanges(oldEvent, newEvent) {
    const changes = [];
    if (oldEvent.name !== newEvent.name) changes.push("name");
    if (oldEvent.description !== newEvent.description)
      changes.push("description");
    if (oldEvent.date !== newEvent.date) changes.push("date");
    if (oldEvent.location !== newEvent.location) changes.push("location");
    return changes;
  }

  deleteEvent(id) {
    this.events = this.events.filter((event) => event.id !== id);
    this.saveEvents();
  }

  saveEvents() {
    localStorage.setItem("events", JSON.stringify(this.events));
  }

  rsvpToEvent(eventId, userId, status) {
    const event = this.getEvent(eventId);
    if (event) {
      event.rsvps = event.rsvps || {};
      event.rsvps[userId] = status;
      this.updateEvent(event);
    }
  }
}

const eventManager = new EventManager();
