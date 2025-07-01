const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables from a .env file when available
try {
  require('dotenv').config();
} catch (err) {
  // dotenv is optional; ignore if not installed
}

const notionApiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID;

const port = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json'
};

async function handleEvents(res) {
  const url = `https://api.notion.com/v1/databases/${databaseId}/query`;
  const headers = {
    'Authorization': `Bearer ${notionApiKey}`,
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
    const upData = await upRes.json();
    const pastData = await pastRes.json();
    const body = JSON.stringify({ upcoming: upData.results, past: pastData.results });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(body);
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end('Errore nel caricamento eventi');
  }
}

function serveStatic(req, res) {
  const filePath = path.join('.', req.url === '/' ? 'index.html' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath);
    const type = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/events') {
    handleEvents(res);
  } else {
    serveStatic(req, res);
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
