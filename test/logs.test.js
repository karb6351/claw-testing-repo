const http = require('http');
const assert = require('assert');
const { requestHandler } = require('../index');

// Test the logs endpoint using the actual request handler
function testLogsEndpoint() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/logs',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          assert.strictEqual(res.statusCode, 200, 'Logs endpoint should return 200');
          assert.strictEqual(res.headers['content-type'], 'application/json', 'Content-Type should be application/json');

          const response = JSON.parse(data);
          assert.strictEqual(typeof response, 'object', 'Response should be an object');
          assert(Array.isArray(response.logs), 'Response should have logs array');
          assert.strictEqual(response.logs.length, 0, 'Logs array should be empty');
          assert.strictEqual(response.count, 0, 'Count should be 0');

          console.log('✓ Logs endpoint test passed');
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Use the actual request handler from index.js
const server = http.createServer(requestHandler);

async function runTests() {
  server.listen(3002, async () => {
    console.log('Test server running on port 3002 (using actual handler)');
    try {
      await testLogsEndpoint();
      console.log('All tests passed!');
      process.exit(0);
    } catch (error) {
      console.error('Test failed:', error.message);
      process.exit(1);
    } finally {
      server.close();
    }
  });
}

runTests();
