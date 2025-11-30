import mysql from 'mysql2/promise';
import pg from 'pg';

const { Pool } = pg;

// Detectar tipo de banco de dados pela porta ou variável de ambiente
const DB_TYPE = process.env.DB_TYPE || (process.env.DB_PORT === '5432' ? 'postgres' : 'mysql');

let pool;

if (DB_TYPE === 'postgres') {
  // PostgreSQL (Render)
  console.log('🐘 Conectando ao PostgreSQL...');
  
  const pgPool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 10,
  });

  // Adapter para manter interface compatível com mysql2
  pool = {
    query: async (sql, params) => {
      // Converter placeholders MySQL (?) para PostgreSQL ($1, $2, etc)
      let paramIndex = 1;
      const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
      
      const result = await pgPool.query(pgSql, params);
      return [result.rows, result.fields];
    },
    execute: async (sql, params) => {
      let paramIndex = 1;
      const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
      
      const result = await pgPool.query(pgSql, params);
      return [result.rows, result.fields];
    },
    end: () => pgPool.end()
  };

} else {
  // MySQL (Local/Docker)
  console.log('🐬 Conectando ao MySQL...');
  
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

console.log(`📊 Banco de dados: ${DB_TYPE.toUpperCase()}`);
console.log(`🔗 Host: ${process.env.DB_HOST}`);

export { pool, DB_TYPE };
