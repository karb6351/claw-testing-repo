const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const http = require("http");
const createApp = require("./app");

describe("GET /timestamp", () => {
  let server;
  let baseUrl;

  before((_, done) => {
    server = createApp();
    server.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  it("returns a JSON object with a valid ISO 8601 timestamp", (_, done) => {
    const before = new Date();
    http.get(`${baseUrl}/timestamp`, (res) => {
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers["content-type"], "application/json");

      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        const data = JSON.parse(body);
        assert.ok(data.timestamp, "response should have a timestamp field");

        const ts = new Date(data.timestamp);
        const after = new Date();
        assert.ok(!isNaN(ts.getTime()), "timestamp should be a valid date");
        assert.ok(ts >= before && ts <= after, "timestamp should be close to now");
        assert.strictEqual(data.timestamp, ts.toISOString(), "timestamp should be in ISO format");
        done();
      });
    });
  });
});
