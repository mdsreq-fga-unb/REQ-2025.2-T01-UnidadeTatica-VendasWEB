import pool from './db/connection.js';

async function testarConexao() {
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log('Conexão com banco funcionando!', rows);
  } catch (err) {
    console.error('Erro ao conectar no banco:', err);
  }
}

testarConexao();
