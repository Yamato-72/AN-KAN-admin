import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var odaPayPool: mysql.Pool | undefined;
}

const odaPayDb =
  global.odaPayPool ||
  mysql.createPool({
    host: process.env.ODA_PAY_DB_HOST,
    user: process.env.ODA_PAY_DB_USER,
    password: process.env.ODA_PAY_DB_PASSWORD,
    database: process.env.ODA_PAY_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") {
  global.odaPayPool = odaPayDb;
}

export default odaPayDb;