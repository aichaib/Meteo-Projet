import sql from "mssql";

let pool;

export async function getSqlPool() {
  if (pool) return pool;
  pool = await sql.connect({
    user:     process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    server:   process.env.AZURE_SQL_HOST,
    database: process.env.AZURE_SQL_DATABASE,
    port:     1433,
    options: {
      encrypt: true,
      trustServerCertificate: false
    }
  });
  return pool;
}
