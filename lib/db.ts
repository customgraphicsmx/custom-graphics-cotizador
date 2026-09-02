import { Pool, types } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL no está configurada.");

// PostgreSQL entrega NUMERIC y BIGINT como texto. La aplicación realiza cálculos,
// formatos y diagramas con estos valores, por lo que deben entrar como números.
types.setTypeParser(1700, (value) => Number(value));
types.setTypeParser(20, (value) => Number(value));

const globalForDb = globalThis as unknown as { customGraphicsPool?: Pool };
export const db = globalForDb.customGraphicsPool ?? new Pool({ connectionString });
if (process.env.NODE_ENV !== "production") globalForDb.customGraphicsPool = db;
