const createApp = require("./app");
const server = createApp();
server.listen(3000, () => console.log("Running on :3000"));
