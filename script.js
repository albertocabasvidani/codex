async function fetchEvents() {
  try {
    const res = await fetch('events.json');
    const data = await res.json();
    populateLists(data.upcoming, data.past);
  } catch (err) {
    console.error('Failed to load events', err);
  }
}

function populateLists(upcoming = [], past = []) {
  const upcomingList = document.getElementById('upcoming-list');
  const pastList = document.getElementById('past-list');
  upcomingList.innerHTML = '';
  pastList.innerHTML = '';

  upcoming.forEach(page => {
    const name = page.properties.Name.title[0].plain_text;
    const dateProp = page.properties.Data;
    if (dateProp && dateProp.date) {
      const date = new Date(dateProp.date.start);
      const item = document.createElement('li');
      item.textContent = `${name} - ${date.toLocaleDateString()}`;
      upcomingList.appendChild(item);
    }
  });

  past.forEach(page => {
    const name = page.properties.Name.title[0].plain_text;
    const dateProp = page.properties.Data;
    const locationProp = page.properties.Location;
    if (dateProp && dateProp.date) {
      const date = new Date(dateProp.date.start);
      const item = document.createElement('li');
      item.textContent = `${name} - ${date.toLocaleDateString()}`;
      pastList.appendChild(item);
      if (locationProp && locationProp.rich_text && locationProp.rich_text.length > 0) {
        addMarker(locationProp.rich_text[0].plain_text);
      }
    }
  });
}

// Mappa con Leaflet
// Center the map on Friuli Venezia Giulia, Italy
const map = L.map('mapid').setView([46.1, 13.2], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

function addMarker(location) {
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        L.marker([lat, lon]).addTo(map).bindPopup(location);
      }
    });
}

