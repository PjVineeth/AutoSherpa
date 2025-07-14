const { Pool } = require("pg");

// Use DATABASE_URL from environment or fallback to provided Neon connection string
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      connectionString: "postgresql://neondb_owner:npg_xkSz7oip0JeM@ep-delicate-snow-a1akvrf4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    });

module.exports = pool;
