import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var ankanPool: Pool | undefined;
}

const ankanDb =
  global.ankanPool ||
  new Pool({
    host: process.env.ANKAN_DB_HOST,
    user: process.env.ANKAN_DB_USER,
    password: process.env.ANKAN_DB_PASSWORD,
    database: process.env.ANKAN_DB_NAME,
    port: Number(process.env.ANKAN_DB_PORT || 5432),
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  global.ankanPool = ankanDb;
}

export default ankanDb;