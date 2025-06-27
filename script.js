const notionApiKey = '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'; // Sostituisci con il tuo token
const databaseId = '5fe69fd43f1740b0b2e94b9b61a863a4'; // Sostituisci con l'ID del calendario

async function fetchEvents() {
  const url = `https://api.notion.com/v1/databases/${databaseId}/query`;
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${notionApiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({page_size: 100})
  };

  const response = await fetch(url, options);
  const data = await response.json();

  const upcomingList = document.getElementById('upcoming-list');
  const pastList = document.getElementById('past-list');

  const now = new Date();

  data.results.forEach(page => {
    const name = page.properties.Name.title[0].plain_text;
    const dateProp = page.properties.Date;
    const locationProp = page.properties.Location;

    if (dateProp && dateProp.date) {
      const date = new Date(dateProp.date.start);
      const item = document.createElement('li');
      item.textContent = `${name} - ${date.toLocaleDateString()}`;

      if (date >= now) {
        upcomingList.appendChild(item);
      } else {
        pastList.appendChild(item);
        if (locationProp && locationProp.rich_text.length > 0) {
          addMarker(locationProp.rich_text[0].plain_text);
        }
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
