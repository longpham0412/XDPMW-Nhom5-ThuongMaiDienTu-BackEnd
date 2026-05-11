const express = require("express");
const { query } = require("../Config/db");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const rows = await query("SELECT * FROM orders LIMIT 100");
    res.json({ data: rows });
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      error.status = 501;
      error.message = "orders table does not exist. Import or create database schema first.";
    }
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const rows = await query("SELECT * FROM orders WHERE id = ? LIMIT 1", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ data: rows[0] });
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      error.status = 501;
      error.message = "orders table does not exist. Import or create database schema first.";
    }
    next(error);
  }
});

module.exports = router;
