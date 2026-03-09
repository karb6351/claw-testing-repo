const http = require('http');
const assert = require('assert');

// Test the health endpoint
function testHealthEndpoint() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001, // Use different port for tests to avoid conflicts
      path: '/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          // Test status code
          assert.strictEqual(res.statusCode, 200, 'Health endpoint should return 200');

          // Test content type
          assert.strictEqual(res.headers['content-type'], 'application/json', 'Content-Type should be application/json');

          // Parse JSON response
          const response = JSON.parse(data);

          // Test JSON structure
          assert.strictEqual(typeof response, 'object', 'Response should be an object');
          assert.strictEqual(response.status, 'ok', 'Response should have status "ok"');
          assert.strictEqual(typeof response.uptime, 'number', 'Response should have numeric uptime');
          assert(response.uptime >= 0, 'Uptime should be non-negative');

          console.log('✓ Health endpoint test passed');
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Create test server
const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from claw-testing-repo' }));
  } else if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Run the test
async function runTests() {
  try {
    console.log('Starting test server...');
    server.listen(3001, async () => {
      console.log('Test server running on port 3001');

      try {
        await testHealthEndpoint();
        console.log('All tests passed!');
        process.exit(0);
      } catch (error) {
        console.error('Test failed:', error.message);
        process.exit(1);
      } finally {
        server.close();
      }
    });
  } catch (error) {
    console.error('Failed to start test server:', error.message);
    process.exit(1);
  }
}

runTests();