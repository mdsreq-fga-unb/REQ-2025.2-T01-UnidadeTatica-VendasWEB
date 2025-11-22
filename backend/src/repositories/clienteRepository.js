import db from '../db/connection.js'

async function emailExiste(email) {//veridica se ja existe um cliente com o email informado
    const [rows] = await db.query(//retorna o id do usuario com esse email
        "SELECT id FROM cliente WHERE email = ?",
        [email]
    );
    return rows.length > 0;//retorna truen se o array que db.query retorna tiver tamanho != 0
}

async function inserirCliente(cliente) {
  try {
    const { nome, email, senhaHash, telefone } = cliente;
    const [result] = await db.query(
      'INSERT INTO cliente (nome, email, senha_hash, telefone) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, telefone]
    );
    return { id: result.insertId };
  } catch (error) {
    console.error('erro ao inserir cliente:', error);
    throw new Error('não foi possível inserir o cliente.');
  }
}



module.exports = {
    emailExiste,
    inserirCliente
};