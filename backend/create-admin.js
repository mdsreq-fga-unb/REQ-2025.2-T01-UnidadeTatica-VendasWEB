// Script para criar usuário admin com credenciais específicas
// Login: admin
// Senha: senha123

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdminUser() {
  try {
    // Gerar hash da senha
    const password = 'senha123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('🔐 Hash gerado para senha "senha123":');
    console.log(hashedPassword);
    
    // Conectar ao banco
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    
    console.log('\n📦 Conectado ao banco de dados');
    
    // Verificar se usuário já existe
    const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin']);
    
    if (existing.length > 0) {
      console.log('\n⚠️  Usuário admin já existe. Atualizando...');
      await connection.query(
        'UPDATE users SET password = ?, role = ?, name = ? WHERE email = ?',
        [hashedPassword, 'admin', 'Administrador', 'admin']
      );
      console.log('✅ Usuário admin atualizado com sucesso!');
    } else {
      console.log('\n➕ Criando novo usuário admin...');
      await connection.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Administrador', 'admin', hashedPassword, 'admin']
      );
      console.log('✅ Usuário admin criado com sucesso!');
    }
    
    // Buscar e exibir dados do admin
    const [admin] = await connection.query(
      'SELECT id, name, email, role, created_at FROM users WHERE email = ?',
      ['admin']
    );
    
    console.log('\n🎖️  Credenciais do Admin:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Login: admin');
    console.log('Senha: senha123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Dados no banco:');
    console.log(admin[0]);
    
    await connection.end();
    console.log('\n✨ Processo concluído!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

createAdminUser();
