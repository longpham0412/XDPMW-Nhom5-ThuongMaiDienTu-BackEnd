const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { getDbStatus } = require("./Config/db");
const authRoutes = require("./Route/authRoutes");
const productRoutes = require("./Route/productRoutes");
const orderRoutes = require("./Route/orderRoutes");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "XDPMW Nhom 5 Thuong Mai Dien Tu API",
    health: "/api/health",
  });
});

app.get("/api/health", async (req, res) => {
  const db = await getDbStatus();

  res.json({
    status: "ok",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: db,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
