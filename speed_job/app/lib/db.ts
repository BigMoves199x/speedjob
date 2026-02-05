// app/lib/db.ts
import "server-only";
import { Pool } from "pg";

let _pool: Pool | null = null;

function requireDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Missing env var: DATABASE_URL");
  return url;
}

export function getPool(): Pool {
  if (_pool) return _pool;

  _pool = new Pool({
    connectionString: requireDatabaseUrl(),
    ssl: { rejectUnauthorized: false },
  });

  return _pool;
}
