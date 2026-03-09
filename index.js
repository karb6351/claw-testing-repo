const http = require('http');

const PORT = process.env.PORT || 3000;

function requestHandler(req, res) {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from claw-testing-repo' }));
  } else if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
  } else if (req.url === '/logs' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ logs: [], count: 0 }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
}

const server = http.createServer(requestHandler);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { requestHandler, server };
