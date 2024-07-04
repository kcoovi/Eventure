class MapManager {
  constructor() {
    this.map = null;
    this.geocoder = null;
  }

  initMap(elementId) {
    this.map = L.map(elementId).setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map);

    this.geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    }).addTo(this.map);

    this.geocoder.on("markgeocode", (e) => {
      const { center, name } = e.geocode;
      this.setView(center.lat, center.lng);
      this.addMarker(center.lat, center.lng, name);
      document.getElementById("event-location").value = name;
      document.getElementById("event-lat").value = center.lat;
      document.getElementById("event-lng").value = center.lng;
    });
  }

  addMarker(lat, lng, popupContent) {
    L.marker([lat, lng]).addTo(this.map).bindPopup(popupContent).openPopup();
  }

  setView(lat, lng, zoom = 13) {
    this.map.setView([lat, lng], zoom);
  }
}

const mapManager = new MapManager();
