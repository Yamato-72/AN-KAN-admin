import { Pool } from "pg";

const connectionString = process.env.ANKAN_DATABASE_URL;

const ankanDb = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Railwayの場合ほぼ必要
  },
});

export default ankanDb;