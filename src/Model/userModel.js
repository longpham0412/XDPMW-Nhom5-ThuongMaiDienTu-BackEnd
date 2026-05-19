const { query } = require("../Config/db");

const findUserByEmail = async (email) => {
  const rows = await query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
};

const findUserByUsername = async (username) => {
  const rows = await query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
  return rows[0] || null;
};

module.exports = {
  findUserByEmail,
  findUserByUsername,
};
