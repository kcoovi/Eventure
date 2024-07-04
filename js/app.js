class EventPlatform {
  constructor() {
    this.init();
    this.setupMenuToggle();
  }

  init() {
    this.renderNavMenu();
    this.renderMainContent();
  }

  renderNavMenu() {
    const navMenu = document.getElementById("nav-menu");
    navMenu.innerHTML = auth.isAuthenticated
      ? `
        <button onclick="app.showHome()">Home</button>
        <button onclick="app.showCreateEvent()">Create Event</button>
        <button onclick="app.showMyEvents()">My Events</button>
        <button onclick="app.showNotifications()">Notifications</button>
        <button onclick="app.logout()">Logout</button>
      `
      : `
        <button onclick="app.showLogin()">Login</button>
        <button onclick="app.showRegister()">Register</button>
      `;
  }

  setupMenuToggle() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  renderMainContent() {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = auth.isAuthenticated
      ? this.renderHome()
      : this.loginForm();
  }

  renderHome() {
    const upcomingEvents = eventManager.getUpcomingEvents(
      auth.getCurrentUserId()
    );
    return `
      <h2 class="welcome-message">Welcome to the Event Planning Platform</h2>
      <h3>Upcoming Events</h3>
      ${
        upcomingEvents.length > 0
          ? `<ul>
              ${upcomingEvents
                .map(
                  (event) => `
                  <li>
                      ${event.name} - ${new Date(event.date).toLocaleString()}
                  </li>
              `
                )
                .join("")}
             </ul>`
          : `<p class="no-events-message">No events at the moment</p>`
      }
    `;
  }

  loginForm() {
    return `
      <div class="auth-form">
        <h2>Login</h2>
        <form onsubmit="app.login(event)">
          <input type="email" id="email" required placeholder="Email">
          <input type="password" id="password" required placeholder="Password">
          <button type="submit">Login</button>
        </form>
      </div>
    `;
  }

  registerForm() {
    return `
      <div class="auth-form">
        <h2>Register</h2>
        <form onsubmit="app.register(event)">
          <input type="email" id="reg-email" required placeholder="Email">
          <input type="password" id="reg-password" required placeholder="Password">
          <button type="submit">Register</button>
        </form>
      </div>
    `;
  }

  login(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (auth.login(email, password)) {
      this.init();
    } else {
      alert("Invalid credentials");
    }
  }

  logout() {
    auth.logout();
    this.init();
  }

  register(event) {
    event.preventDefault();
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    if (auth.register(email, password)) {
      this.init();
    } else {
      alert("Registration failed. User may already exist.");
    }
  }

  showHome() {
    document.getElementById("main-content").innerHTML = this.renderHome();
  }

  showLogin() {
    document.getElementById("main-content").innerHTML = this.loginForm();
  }

  showRegister() {
    document.getElementById("main-content").innerHTML = this.registerForm();
  }

  showCreateEvent() {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
      <h2>Create Event</h2>
      <form onsubmit="app.createEvent(event)">
        <input type="text" id="event-name" required placeholder="Event Name">
        <textarea id="event-description" required placeholder="Event Description"></textarea>
        <input type="datetime-local" id="event-date" required>
        <input type="text" id="event-location" required placeholder="Search for event location">
        <input type="hidden" id="event-lat">
        <input type="hidden" id="event-lng">
        <button type="submit">Create Event</button>
      </form>
      <div id="map"></div>
    `;
    mapManager.initMap("map");
  }

  createEvent(event) {
    event.preventDefault();
    const newEvent = {
      id: Date.now(),
      name: document.getElementById("event-name").value,
      description: document.getElementById("event-description").value,
      date: document.getElementById("event-date").value,
      location: document.getElementById("event-location").value,
      lat: document.getElementById("event-lat").value,
      lng: document.getElementById("event-lng").value,
      creator: auth.getCurrentUserId(),
    };
    eventManager.createEvent(newEvent);
    this.showMyEvents();
  }

  showMyEvents() {
    const events = eventManager.getEvents(auth.getCurrentUserId());
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
      <h2>My Events</h2>
      ${
        events.length > 0
          ? `<ul>
              ${events
                .map(
                  (event) => `
                  <li>
                      ${event.name} - ${new Date(event.date).toLocaleString()}
                      <button onclick="app.showEventDetails(${
                        event.id
                      })">View Details</button>
                      <button onclick="app.showEditEvent(${
                        event.id
                      })">Edit</button>
                      <button onclick="app.deleteEvent(${
                        event.id
                      })">Delete</button>
                  </li>
              `
                )
                .join("")}
             </ul>`
          : `<p class="no-events-message">No events at the moment</p>`
      }
    `;
  }

  showEventDetails(id) {
    const event = eventManager.getEvent(id);
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
      <div class="event-details">
        <div class="event-info">
          <h2>${event.name}</h2>
          <p>${event.description}</p>
          <p>Date: ${new Date(event.date).toLocaleString()}</p>
          <p>Location: ${event.location}</p>
          ${this.renderRSVPButtons(event)}
          <div id="map"></div>
        </div>
        <div id="qrcode"></div>
      </div>
    `;
    mapManager.initMap("map");
    mapManager.setView(parseFloat(event.lat), parseFloat(event.lng));
    mapManager.addMarker(
      parseFloat(event.lat),
      parseFloat(event.lng),
      event.name
    );

    // Generate QR code
    const eventUrl = `${window.location.origin}${window.location.pathname}?event=${event.id}`;
    new QRCode(document.getElementById("qrcode"), eventUrl);
  }

  renderRSVPButtons(event) {
    const userId = auth.getCurrentUserId();
    const currentRSVP = event.rsvps && event.rsvps[userId];
    return `
      <button onclick="app.rsvpToEvent(${event.id}, 'going')" class="${
      currentRSVP === "going" ? "selected" : ""
    }">Going</button>
      <button onclick="app.rsvpToEvent(${event.id}, 'maybe')" class="${
      currentRSVP === "maybe" ? "selected" : ""
    }">Maybe</button>
      <button onclick="app.rsvpToEvent(${event.id}, 'not-going')" class="${
      currentRSVP === "not-going" ? "selected" : ""
    }">Not Going</button>
    `;
  }

  showEditEvent(id) {
    const event = eventManager.getEvent(id);
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
      <h2>Edit Event</h2>
      <form onsubmit="app.updateEvent(event, ${id})">
        <input type="text" id="edit-event-name" required value="${event.name}">
        <textarea id="edit-event-description" required>${event.description}</textarea>
        <input type="datetime-local" id="edit-event-date" required value="${event.date}">
        <input type="text" id="edit-event-location" required value="${event.location}">
        <input type="hidden" id="edit-event-lat" value="${event.lat}">
        <input type="hidden" id="edit-event-lng" value="${event.lng}">
        <button type="submit">Update Event</button>
      </form>
      <div id="map"></div>
    `;
    mapManager.initMap("map");
    mapManager.setView(parseFloat(event.lat), parseFloat(event.lng));
    mapManager.addMarker(
      parseFloat(event.lat),
      parseFloat(event.lng),
      event.name
    );
  }

  updateEvent(event, id) {
    event.preventDefault();
    const updatedEvent = {
      id: id,
      name: document.getElementById("edit-event-name").value,
      description: document.getElementById("edit-event-description").value,
      date: document.getElementById("edit-event-date").value,
      location: document.getElementById("edit-event-location").value,
      lat: document.getElementById("edit-event-lat").value,
      lng: document.getElementById("edit-event-lng").value,
      creator: auth.getCurrentUserId(),
    };
    const changes = eventManager.updateEvent(updatedEvent);
    if (changes.length > 0) {
      notificationManager.addEventChangeNotification(
        updatedEvent.name,
        changes
      );
    }
    this.showMyEvents();
  }

  deleteEvent(id) {
    if (confirm("Are you sure you want to delete this event?")) {
      eventManager.deleteEvent(id);
      this.showMyEvents();
    }
  }

  rsvpToEvent(eventId, status) {
    const userId = auth.getCurrentUserId();
    eventManager.rsvpToEvent(eventId, userId, status);
    const event = eventManager.getEvent(eventId);
    notificationManager.addRSVPNotification(event.name, status);
    this.showEventDetails(eventId);
  }

  showNotifications() {
    const notifications = notificationManager.getNotifications(
      auth.getCurrentUserId()
    );
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
      <h2>Notifications</h2>
      ${
        notifications.length > 0
          ? `<button onclick="app.clearAllNotifications()">Clear All Notifications</button>
             <ul>
              ${notifications
                .map(
                  (notification) => `
                  <li class="${notification.read ? "notification-read" : ""}">
                      ${notification.message}
                      ${
                        notification.read
                          ? ""
                          : '<button onclick="app.markNotificationAsRead(' +
                            notification.id +
                            ')">Mark as Read</button>'
                      }
                  </li>
              `
                )
                .join("")}
             </ul>`
          : `<p class="no-notifications-message">No notifications</p>`
      }
    `;
  }

  markNotificationAsRead(id) {
    notificationManager.markAsRead(id);
    this.showNotifications();
  }

  clearAllNotifications() {
    if (confirm("Are you sure you want to clear all notifications?")) {
      notificationManager.clearAllNotifications(auth.getCurrentUserId());
      this.showNotifications();
    }
  }
}

const app = new EventPlatform();

// Check for event in URL parameters
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get("event");
if (eventId) {
  app.showEventDetails(parseInt(eventId));
}
