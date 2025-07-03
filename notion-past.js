// notion-past.js
// Load past concerts from public/past-notion.json, list them and add markers

async function loadPastFromNotion() {
  try {
    const res = await fetch('public/past-notion.json');
    const pages = await res.json();

    const pastList = document.getElementById('past-list');
    pastList.innerHTML = '';

    const now = new Date();

    pages.forEach(page => {
      const props = page.properties || {};
      const dateProp = props.Data;
      const nameProp = props.Name;
      const locationProp = props.Location || props.Luogo;
      if (!dateProp || !dateProp.date || !dateProp.date.start) return;
      const date = new Date(dateProp.date.start);
      if (date >= now) return;
      const name = nameProp?.title?.[0]?.plain_text || '';
      const item = document.createElement('li');
      item.textContent = `${name} - ${date.toLocaleDateString()}`;
      pastList.appendChild(item);
      if (locationProp?.rich_text?.length) {
        addMarker(locationProp.rich_text[0].plain_text);
      }
    });
  } catch (err) {
    console.error('Failed to load past concerts from Notion', err);
  }
}

document.addEventListener('DOMContentLoaded', loadPastFromNotion);
