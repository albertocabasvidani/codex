
const NOTION_API_KEY = '5fe69fd43f1740b0b2e94b9b61a863a4';
const NOTION_DATABASE_ID = '3c372175215e43ec95ce3c35feee1b31';
const NOTION_VERSION = '2022-06-28';

async function fetchEvents() {
  const url = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`;
  const headers = {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json'
  };
  const today = new Date().toISOString().split('T')[0];
  const body = {
    page_size: 100,
    filter: { property: 'Data', date: { on_or_after: today } },
    sorts: [{ property: 'Data', direction: 'ascending' }]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    console.error('Notion API error', await res.text());
    return;
  }
  const notionData = await res.json();
  const events = notionData.results;

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
