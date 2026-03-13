const http = require("http");

function createApp() {
  return http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "GET" && req.url === "/") {
      res.end(JSON.stringify({ message: "hello world" }));
    } else if (req.method === "GET" && req.url === "/users") {
      res.end(JSON.stringify([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" }
      ]));
    } else if (req.method === "GET" && req.url === "/timestamp") {
      res.end(JSON.stringify({ timestamp: new Date().toISOString() }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  });
}

module.exports = createApp;
