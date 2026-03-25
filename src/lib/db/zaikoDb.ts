import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var zaikoPool: mysql.Pool | undefined;
}

const zaikoDb =
  global.zaikoPool ||
  mysql.createPool({
    host: process.env.ZAIKO_DB_HOST,
    user: process.env.ZAIKO_DB_USER,
    password: process.env.ZAIKO_DB_PASSWORD,
    database: process.env.ZAIKO_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") {
  global.zaikoPool = zaikoDb;
}

export default zaikoDb;