const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables from a .env file when available
try {
  require('dotenv').config();
} catch (err) {
  // dotenv is optional; ignore if not installed
}

const port = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json'
};


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
  serveStatic(req, res);
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
