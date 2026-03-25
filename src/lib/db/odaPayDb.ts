import mysql from "mysql2/promise";

const odaPayDb = mysql.createPool({
  uri: process.env.ODA_PAY_DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default odaPayDb;