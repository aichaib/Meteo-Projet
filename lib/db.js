import sql from "mssql";

const globalForSql = globalThis;  

export async function getSqlPool() {
  if (!globalForSql._pool) {
    globalForSql._pool = await sql.connect({
      user:     process.env.AZURE_SQL_USER,
      password: process.env.AZURE_SQL_PASSWORD,
      server:   process.env.AZURE_SQL_HOST,
      database: process.env.AZURE_SQL_DATABASE,
      options: { encrypt: true }           // TLS obligatoire sur Azure
    });
  }
  return globalForSql._pool;
}
