const express = require("express");
const { login, me } = require("../Controller/authController");
const { requireAuth } = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/me", requireAuth, me);

module.exports = router;
