
async function fetchEvents() {
  try {
    const res = await fetch('/events');

    const text = await res.text();
    if (!res.ok) {
      displayApiOutput(text);
      return;
    }
    const data = JSON.parse(text);
    populateLists(data.upcoming, data.past);
  } catch (err) {
    displayApiOutput(String(err));

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



  past.forEach(page => {
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
    });

    pastData.results.forEach(page => {
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

  } catch (err) {
    console.error('Impossibile recuperare gli eventi', err);
  }
}

function displayApiOutput(raw) {
  const upcomingList = document.getElementById('upcoming-list');
  const pastList = document.getElementById('past-list');
  upcomingList.innerHTML = `<pre>${raw}</pre>`;
  pastList.innerHTML = '';
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
