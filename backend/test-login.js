import pg from 'pg';
import bcrypt from 'bcrypt';

const { Pool } = pg;

// Conectar no PostgreSQL do Render
const pgPool = new Pool({
  host: 'dpg-d4m6mfeuk2gs738p6plg-a.oregon-postgres.render.com',
  user: 'unidade_tatica_user',
  password: 'ZqzmVHzoVdqiZ2hqhSspVptg3YeUGd4l',
  database: 'unidade_tatica',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

async function testLogin() {
  try {
    console.log('🔍 Testando busca do usuário admin...');
    
    // Teste 1: Query direta PostgreSQL
    const result1 = await pgPool.query('SELECT * FROM users WHERE email = $1', ['admin']);
    console.log('✅ Query PostgreSQL direta:', result1.rows[0]);
    
    // Teste 2: Simulando o adapter
    const query = async (sql, params) => {
      let paramIndex = 1;
      const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
      console.log('🔄 SQL convertido:', pgSql);
      console.log('📋 Params:', params);
      
      const result = await pgPool.query(pgSql, params);
      return [result.rows, result.fields];
    };
    
    const [users] = await query('SELECT * FROM users WHERE email = ?', ['admin']);
    console.log('✅ Query com adapter:', users[0]);
    
    // Teste 3: Verificar senha
    if (users.length > 0) {
      const user = users[0];
      console.log('🔐 Testando senha...');
      console.log('Hash no banco:', user.password);
      
      const validPassword = await bcrypt.compare('senha123', user.password);
      console.log('✅ Senha válida?', validPassword);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await pgPool.end();
  }
}

testLogin();
