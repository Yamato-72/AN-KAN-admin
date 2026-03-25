import mysql from "mysql2/promise";

const zaikoDb = mysql.createPool({
  uri: process.env.ZAIKO_DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default zaikoDb;