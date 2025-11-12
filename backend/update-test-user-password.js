const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function updateTestUserPassword() {
  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash('teste123', 10);
    
    console.log('Hash gerado:', hashedPassword);
    
    // Conectar ao banco
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'mysql-db',
      port: 3306,
      user: 'root',
      password: 'rootpassword',
      database: 'meubanco'
    });

    // Atualizar senha do usuário
    const [result] = await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, 'userteste']
    );

    console.log('✅ Senha do usuário atualizada com sucesso!');
    console.log('Login: userteste');
    console.log('Senha: teste123');

    await connection.end();
  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error.message);
  }
}

updateTestUserPassword();
