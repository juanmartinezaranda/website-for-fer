const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT) || 3000;
const root = path.join(__dirname, 'public');

// Kept in memory on purpose: the answer lasts for this server process only.
let saidYes = false;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/answer') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify({ saidYes }));
  }

  if (req.method === 'POST' && req.url === '/api/answer') {
    saidYes = true;
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify({ saidYes }));
  }

  const pathname = req.url === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0]);
  const filename = path.resolve(root, `.${pathname}`);
  if (!filename.startsWith(root + path.sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filename, (error, data) => {
    if (error) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const type = filename.endsWith('.css') ? 'text/css' : filename.endsWith('.js') ? 'text/javascript' : 'text/html';
    res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8` });
    res.end(data);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`The question is ready at http://localhost:${port}`);
});
