const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function createTestUser() {
  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash('teste123', 10);
    
    // Conectar ao banco
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'mysql-db',
      port: 3306,
      user: 'root',
      password: 'rootpassword',
      database: 'meubanco'
    });

    // Inserir usuário
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Usuário Teste', 'userteste', hashedPassword, 'user']
    );

    console.log('✅ Usuário de teste criado com sucesso!');
    console.log('Login: userteste');
    console.log('Senha: teste123');
    console.log('ID:', result.insertId);

    await connection.end();
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
  }
}

createTestUser();
