import mysql from 'mysql2/promise';
import pg from 'pg';

const { Pool } = pg;

// Detectar tipo de banco de dados pela porta ou variável de ambiente
const DB_TYPE = process.env.DB_TYPE || (process.env.DB_PORT === '5432' ? 'postgres' : 'mysql');

let pool;

if (DB_TYPE === 'postgres') {
  // PostgreSQL (Render)
  console.log('🐘 Conectando ao PostgreSQL...');
  
  // Usar a DATABASE_URL se existir (Render fornece automaticamente)
  const DATABASE_URL = process.env.DATABASE_URL;
  
  let pgPool;
  
  if (DATABASE_URL) {
    console.log('📡 Usando DATABASE_URL do Render');
    pgPool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  } else {
    console.log('📡 Usando variáveis individuais de ambiente');
    pgPool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 5432,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }

  // Tratamento de erros do pool
  pgPool.on('error', (err) => {
    console.error('❌ Erro inesperado no pool PostgreSQL:', err.message);
  });

  pgPool.on('connect', () => {
    console.log('✅ Nova conexão PostgreSQL estabelecida');
  });

  // Adapter para manter interface compatível com mysql2
  pool = {
    query: async (sql, params) => {
      try {
        // Converter placeholders MySQL (?) para PostgreSQL ($1, $2, etc)
        let paramIndex = 1;
        const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
        
        console.log('🔍 SQL:', pgSql, 'Params:', params);
        const result = await pgPool.query(pgSql, params);
        console.log('✅ Query executada, linhas retornadas:', result.rows.length);
        return [result.rows, result.fields];
      } catch (error) {
        console.error('❌ Erro na query:', error.message);
        console.error('Stack completo:', error.stack);
        throw error;
      }
    },
    execute: async (sql, params) => {
      try {
        let paramIndex = 1;
        const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
        
        const result = await pgPool.query(pgSql, params);
        return [result.rows, result.fields];
      } catch (error) {
        console.error('❌ Erro no execute:', error.message);
        throw error;
      }
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
