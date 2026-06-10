import { Pool } from "pg";

console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
console.log("PGHOST:", process.env.PGHOST);

function getPoolConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };
  }

  return {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: { rejectUnauthorized: false },
  };
}

export const pool = new Pool(getPoolConfig());