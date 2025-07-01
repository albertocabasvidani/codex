const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables from a .env file when available
try {
  require('dotenv').config();
} catch (err) {
  // dotenv is optional; ignore if not installed
}

// Notion credentials. Can be overridden by environment variables
const notionApiKey =
  process.env.NOTION_API_KEY ||
  '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';
const databaseId =
  process.env.NOTION_DATABASE_ID ||
  '5fe69fd43f1740b0b2e94b9b61a863a4';

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
  const query = {
    filter: { property: 'Data', date: { on_or_after: today } },
    sorts: [{ property: 'Data', direction: 'ascending' }]
  };
  try {
    const notionRes = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(query)
    });
    const output = await notionRes.json();
    if (!notionRes.ok) {
      res.writeHead(notionRes.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(output));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ upcoming: output.results }));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

const WEB_ROOT = path.resolve(__dirname);
const allowedFiles = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/script.js': 'script.js',
  '/style.css': 'style.css'
};

function serveStatic(req, res) {
  let reqPath = req.url;
  if (reqPath === '/') reqPath = '/index.html';

  // Normalize and restrict to known files
  reqPath = path.normalize(reqPath);
  const fileName = allowedFiles[reqPath];
  if (!fileName) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const filePath = path.join(WEB_ROOT, fileName);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(WEB_ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(resolved, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(resolved);
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
