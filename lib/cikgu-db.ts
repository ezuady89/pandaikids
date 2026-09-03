import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";

let pool: Pool | undefined;

export function getCikguDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL belum disambungkan pada Vercel.");
  if (!pool) {
    pool = new Pool({ connectionString });
    attachDatabasePool(pool);
  }
  return pool;
}
