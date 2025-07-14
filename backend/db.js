const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "car_duddy",
  password: process.env.PGPASSWORD || "Sneha@1226",
  port: process.env.PGPORT || 5432,
});

module.exports = pool;
