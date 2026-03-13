const http = require("http");
const server = require("./app");

let baseUrl;

beforeAll((done) => {
  server.listen(0, () => {
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`${baseUrl}${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(data), headers: res.headers }));
    }).on("error", reject);
  });
}

describe("GET /env", () => {
  test("returns 200 with nodeVersion, platform, and uptime", async () => {
    const { status, body, headers } = await get("/env");
    expect(status).toBe(200);
    expect(headers["content-type"]).toBe("application/json");
    expect(body).toHaveProperty("nodeVersion");
    expect(body.nodeVersion).toBe(process.version);
    expect(body).toHaveProperty("platform");
    expect(body.platform).toBe(process.platform);
    expect(body).toHaveProperty("uptime");
    expect(typeof body.uptime).toBe("number");
    expect(body.uptime).toBeGreaterThan(0);
  });
});

describe("GET /", () => {
  test("returns hello world", async () => {
    const { status, body } = await get("/");
    expect(status).toBe(200);
    expect(body).toEqual({ message: "hello world" });
  });
});

describe("GET /users", () => {
  test("returns users array", async () => {
    const { status, body } = await get("/users");
    expect(status).toBe(200);
    expect(body).toHaveLength(3);
    expect(body[0]).toEqual({ id: 1, name: "Alice" });
  });
});

describe("404", () => {
  test("returns not found for unknown routes", async () => {
    const { status, body } = await get("/unknown");
    expect(status).toBe(404);
    expect(body).toEqual({ error: "Not Found" });
  });
});
