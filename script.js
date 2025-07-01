
async function fetchEvents() {
  let res;
  try {
    res = await fetch('/events');
    if (!res.ok) throw new Error('server unavailable');
  } catch (err) {
    // On static hosting (e.g. GitHub Pages) the /events endpoint is not
    // available, so fall back to a bundled JSON file with sample data.
    res = await fetch('events.json');
  }
  const data = await res.json();


  const upcomingList = document.getElementById('upcoming-list');
  const pastList = document.getElementById('past-list');


  data.upcoming.forEach(page => {


    const name = page.properties.Name.title[0].plain_text;
    const dateProp = page.properties.Data;
    if (dateProp && dateProp.date) {
      const date = new Date(dateProp.date.start);
      const item = document.createElement('li');
      item.textContent = `${name} - ${date.toLocaleDateString()}`;
      upcomingList.appendChild(item);
    }
  });


  data.past.forEach(page => {

    const name = page.properties.Name.title[0].plain_text;
    const dateProp = page.properties.Data;
    const locationProp = page.properties.Location;
    if (dateProp && dateProp.date) {
      const date = new Date(dateProp.date.start);
      const item = document.createElement('li');
      item.textContent = `${name} - ${date.toLocaleDateString()}`;
      pastList.appendChild(item);
      if (locationProp && locationProp.rich_text.length > 0) {
        addMarker(locationProp.rich_text[0].plain_text);
      }
    }
  });
}

// Mappa con Leaflet
const map = L.map('mapid').setView([0, 0], 2);
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

fetchEvents();
