// notion-upcoming.js
// Load upcoming concerts from public/notion.json and display place and date

async function loadUpcomingFromNotion() {
  try {
    const res = await fetch('public/notion.json');
    const pages = await res.json();

    const upcomingList = document.getElementById('upcoming-list');
    upcomingList.innerHTML = '';

    const now = new Date();

    const events = pages
      .map(page => {
        const dateProp = page.properties?.Data;
        const placeProp = page.properties?.Luogo;
        if (!dateProp?.date || !placeProp?.rich_text?.length) return null;
        return {
          date: new Date(dateProp.date.start),
          place: placeProp.rich_text[0].plain_text
        };
      })
      .filter(e => e && e.date >= now)
      .sort((a, b) => a.date - b.date);

    events.forEach(ev => {
      const item = document.createElement('li');
      item.textContent = `${ev.place} - ${ev.date.toLocaleDateString()}`;
      upcomingList.appendChild(item);
    });
  } catch (err) {
    console.error('Failed to load Notion concerts', err);
  }
}

document.addEventListener('DOMContentLoaded', loadUpcomingFromNotion);
