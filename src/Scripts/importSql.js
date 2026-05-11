require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const { getConfig } = require("../Config/db");

const sqlPath = path.resolve(__dirname, "../../XDPMW_TMDT.sql");

const stripComments = (content) =>
  content
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith("--") && !trimmed.startsWith("/*!");
    })
    .join("\n");

const main = async () => {
  if (!fs.existsSync(sqlPath)) {
    throw new Error(`SQL file not found: ${sqlPath}`);
  }

  const config = getConfig();
  if (!config.host || !config.user || !config.database) {
    throw new Error("Database is not configured. Set DB_* or Railway MYSQL* variables.");
  }

  const sql = stripComments(fs.readFileSync(sqlPath, "utf8"))
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  if (sql.length === 0) {
    console.log("No executable SQL statements found.");
    return;
  }

  const connection = await mysql.createConnection({ ...config, multipleStatements: false });

  try {
    for (const statement of sql) {
      await connection.query(statement);
    }
    console.log(`Imported ${sql.length} SQL statements.`);
  } finally {
    await connection.end();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
