

const NOTION_API_KEY = '5fe69fd43f1740b0b2e94b9b61a863a4';
const DATABASE_ID = '3c372175215e43ec95ce3c35feee1b31';

async function fetchEvents() {
  const url = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;
  const headers = {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  };

  const today = new Date().toISOString().split('T')[0];

  const upcomingQuery = {
    page_size: 100,
    filter: { property: 'Data', date: { after: today } },
    sorts: [{ property: 'Data', direction: 'ascending' }]
  };

  const pastQuery = {
    page_size: 100,
    filter: { property: 'Data', date: { before: today } },
    sorts: [{ property: 'Data', direction: 'descending' }]
  };

  try {
    const [upRes, pastRes] = await Promise.all([
      fetch(url, { method: 'POST', headers, body: JSON.stringify(upcomingQuery) }),
      fetch(url, { method: 'POST', headers, body: JSON.stringify(pastQuery) })
    ]);

    if (!upRes.ok || !pastRes.ok) {
      console.error('Errore caricamento eventi', await upRes.text(), await pastRes.text());
      return;
    }

    const upData = await upRes.json();
    const pastData = await pastRes.json();

    const upcomingList = document.getElementById('upcoming-list');
    upcomingList.innerHTML = '';
    const pastList = document.getElementById('past-list');
    pastList.innerHTML = '';

    upData.results.forEach(page => {
      const name = page.properties.Name.title[0].plain_text;
      const dateProp = page.properties.Data;
      if (dateProp && dateProp.date) {
        const date = new Date(dateProp.date.start);
        const item = document.createElement('li');
        item.textContent = `${name} - ${date.toLocaleDateString()}`;
        upcomingList.appendChild(item);
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
