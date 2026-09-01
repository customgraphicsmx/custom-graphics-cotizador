import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL no está configurada.");

const globalForDb = globalThis as unknown as { customGraphicsPool?: Pool };
export const db = globalForDb.customGraphicsPool ?? new Pool({ connectionString });
if (process.env.NODE_ENV !== "production") globalForDb.customGraphicsPool = db;
