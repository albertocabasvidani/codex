

async function fetchEvents() {
  try {
    const res = await fetch('/events');
    if (!res.ok) {
      console.error('Errore caricamento eventi', await res.text());
      return;
    }
    const data = await res.json();
    const events = [...data.upcoming, ...data.past];
    const today = new Date().toISOString().split('T')[0];

  const upcomingList = document.getElementById('upcoming-list');
  upcomingList.innerHTML = '';
  const pastList = document.getElementById('past-list');
  pastList.innerHTML = '';

    events.forEach(page => {
      const name = page.properties.Name.title[0].plain_text;
      const dateProp = page.properties.Data;
      const locationProp = page.properties.Location;
      if (!dateProp || !dateProp.date) return;
      const date = new Date(dateProp.date.start);
      const item = document.createElement('li');
      item.textContent = `${name} - ${date.toLocaleDateString()}`;
      if (date >= new Date(today)) {
        upcomingList.appendChild(item);
      } else {
        pastList.appendChild(item);
        if (locationProp && locationProp.rich_text.length > 0) {
          addMarker(locationProp.rich_text[0].plain_text);
        }

      }
    });
  } catch (err) {
    console.error('Impossibile recuperare gli eventi', err);
  }
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
