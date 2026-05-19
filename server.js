require("dotenv").config();

const app = require("./src/app");
const { closePool } = require("./src/Config/db");

const port = Number(process.env.PORT) || 3000;

const server = app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Closing server...`);
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
