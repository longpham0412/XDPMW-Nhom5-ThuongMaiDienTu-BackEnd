const mysql = require("mysql2/promise");

let pool;

const getConfig = () => {
  const host = process.env.DB_HOST || process.env.MYSQLHOST;
  const user = process.env.DB_USER || process.env.MYSQLUSER;
  const password = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD;
  const database = process.env.DB_NAME || process.env.MYSQLDATABASE;
  const port = Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306);

  return {
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
  };
};

const isDbConfigured = () => {
  const config = getConfig();
  return Boolean(config.host && config.user && config.database);
};

const getPool = () => {
  if (!isDbConfigured()) {
    const error = new Error("Database is not configured. Set DB_* or Railway MYSQL* variables.");
    error.status = 503;
    throw error;
  }

  if (!pool) {
    pool = mysql.createPool(getConfig());
  }

  return pool;
};

const query = async (sql, params = []) => {
  const [rows] = await getPool().execute(sql, params);
  return rows;
};

const getDbStatus = async () => {
  if (!isDbConfigured()) {
    return {
      configured: false,
      connected: false,
      message: "Database environment variables are not configured.",
    };
  }

  try {
    await query("SELECT 1 AS ok");
    return {
      configured: true,
      connected: true,
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      message: error.message,
    };
  }
};

const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
};

module.exports = {
  getConfig,
  getPool,
  query,
  getDbStatus,
  closePool,
};
