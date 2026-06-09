import { Pool } from "pg";
function getPoolConfig() {
    if (process.env.DATABASE_URL) {
        return { connectionString: process.env.DATABASE_URL };
    }
    const ssl = process.env.PGSSLMODE === "require" ||
        process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined;
    return {
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT),
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        ssl,
    };
}
export const pool = new Pool(getPoolConfig());
