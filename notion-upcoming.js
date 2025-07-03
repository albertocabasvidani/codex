// notion-upcoming.js

// Load upcoming concerts from public/notion.json and display date, venue and location


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

        const locationProp = page.properties?.Luogo;
        const venueProp = page.properties?.Locale;
        if (!dateProp?.date ||
            !locationProp?.rich_text?.length ||
            !venueProp?.title?.length) return null;
        return {
          date: new Date(dateProp.date.start),
          venue: venueProp.title[0].plain_text,
          location: locationProp.rich_text[0].plain_text

        };
      })
      .filter(e => e && e.date >= now)
      .sort((a, b) => a.date - b.date);

    events.forEach(ev => {
      const item = document.createElement('li');

      const dateStr = ev.date.toLocaleDateString();
      item.textContent = `${dateStr} - ${ev.venue}, ${ev.location}`;

      upcomingList.appendChild(item);
    });
  } catch (err) {
    console.error('Failed to load Notion concerts', err);
  }
}

document.addEventListener('DOMContentLoaded', loadUpcomingFromNotion);
