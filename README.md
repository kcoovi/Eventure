# Eventure

Eventure is an event planning platform designed to help users create, manage, and RSVP to events with ease. This application provides features such as event creation and editing, RSVP tracking, notifications, and interactive maps for event locations.

## Description

Eventure is a full-featured web application where users can:
- **Create and Manage Events**: Create new events with details including name, description, date, time, and location.
- **RSVP to Events**: Users can RSVP to events as "Going", "Maybe", or "Not Going".
- **View and Edit Events**: Users can view details of events they have created and edit or delete them as needed.
- **Receive Notifications**: Notifications are sent for RSVP statuses and changes made to events.
- **Interactive Maps**: Use Leaflet and its geocoding service to search for event locations and display them on a map.

## Architecture and Technologies

### Frontend

- **HTML**: Provides the structure of the web pages.
- **CSS**: Styles the application using custom styles and media queries for responsiveness.
- **JavaScript**: Manages dynamic content and user interactions using plain JavaScript.

### Database

- **Local Storage**: Used for storing users, events, and notifications in the browser's local storage.

### Third-Party Libraries and Services

- **Leaflet**: An open-source JavaScript library for interactive maps.
- **Leaflet Control Geocoder**: Provides geocoding functionality for searching locations.
- **QRCode.js**: A library for generating QR codes.

## Features

- **User Authentication**: Users can register, login, and logout.
- **Event Creation**: Users can create events with details and location.
- **Event Management**: Users can view, edit, and delete their events.
- **RSVP Management**: Users can RSVP to events and receive notifications based on their status.
- **Notifications**: Notifications for RSVP changes and event updates.
- **Interactive Map**: Integration with Leaflet for displaying event locations on a map.
- **QR Codes**: Generate QR codes for event URLs.

## Getting started

* Clone the repo
`git clone https://github.com/kcoovi/eventure.git`

* Navigate to the folder
`cd Eventure`

* Run 
Open the index.html in the browser or click [here](https://kcoovi.github.io/Eventure/)
