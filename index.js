const http = require("http");
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "GET" && req.url === "/") {
    res.end(JSON.stringify({ message: "hello world" }));
  } else if (req.method === "GET" && req.url === "/users") {
    res.end(JSON.stringify([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" }
    ]));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});
server.listen(3000, () => console.log("Running on :3000"));
