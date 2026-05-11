const { query } = require("../Config/db");

const login = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({
        message: "username/email and password are required",
      });
    }

    const users = await query(
      "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1",
      [username || "", email || ""]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      message: "Login endpoint is connected. Add password hashing before production use.",
      user: users[0],
    });
  } catch (error) {
    if (error.code === "ER_NO_SUCH_TABLE") {
      error.status = 501;
      error.message = "users table does not exist. Import or create database schema first.";
    }
    return next(error);
  }
};

const me = (req, res) => {
  res.json({
    message: "Authentication middleware is ready. Token validation can be added when auth schema is finalized.",
  });
};

module.exports = {
  login,
  me,
};
