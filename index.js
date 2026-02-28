const http = require("http");
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "GET" && req.url === "/") {
    res.end(JSON.stringify({ message: "hello world" }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});
server.listen(3000, () => console.log("Running on :3000"));
