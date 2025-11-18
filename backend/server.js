require('dotenv').config({ override: true });

console.log("DEBUG ENV → DB_HOST:", process.env.DB_HOST);
console.log("DEBUG ENV → DB_USER:", process.env.DB_USER);
console.log("DEBUG ENV → DB_PASS:", process.env.DB_PASS);
console.log("DEBUG ENV → DB_NAME:", process.env.DB_NAME);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'unidade-tatica-secret-key-2025';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/', (req, res) => {
  res.send('Backend Unidade Tática está funcionando! 🚀');
});

// ===== AUTENTICAÇÃO =====

// Registro de usuário
app.post('/auth/register', async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  try {
    // Verificar se email já existe
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir usuário
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user: { id: result.insertId, name, email, role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // Buscar usuário
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = users[0];

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Verificar token (rota protegida)
app.get('/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// ===== USUÁRIOS =====

// Listar todos os usuários (apenas admin)
app.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Buscar usuário por ID
app.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Usuários comuns só podem ver seus próprios dados
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Criar usuário (apenas admin pode definir role)
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Atualizar usuário
app.put('/users/:id', authenticateToken, async (req, res) => {
  const { name, email } = req.body;
  const userId = parseInt(req.params.id);

  // Usuários comuns só podem atualizar seus próprios dados
  if (req.user.role !== 'admin' && req.user.id !== userId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  try {
    await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, userId]
    );

    const [users] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [userId]
    );

    res.json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário (apenas admin)
app.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

// ===== PRODUTOS =====

// Listar todos os produtos (público)
app.get('/products', async (req, res) => {
  try {
    const { category, active } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (active !== undefined) {
      query += ' AND is_active = ?';
      params.push(active === 'true');
    }

    query += ' ORDER BY created_at DESC';

    const [products] = await pool.query(query, params);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Buscar produto por ID (público)
app.get('/products/:id', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(products[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// Criar produto (apenas admin)
app.post('/products', authenticateToken, isAdmin, async (req, res) => {
  const { name, description, price, category, stock, image_url, is_active } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, category, stock, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description || null, price, category, stock || 0, image_url || null, is_active !== false]
    );

    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Produto criado com sucesso',
      product: newProduct[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Atualizar produto (apenas admin)
app.put('/products/:id', authenticateToken, isAdmin, async (req, res) => {
  const { name, description, price, category, stock, image_url, is_active } = req.body;
  const productId = parseInt(req.params.id);

  try {
    // Verificar se produto existe
    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?, image_url = ?, is_active = ? WHERE id = ?',
      [
        name || existing[0].name,
        description !== undefined ? description : existing[0].description,
        price || existing[0].price,
        category || existing[0].category,
        stock !== undefined ? stock : existing[0].stock,
        image_url !== undefined ? image_url : existing[0].image_url,
        is_active !== undefined ? is_active : existing[0].is_active,
        productId
      ]
    );

    const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);

    res.json({
      message: 'Produto atualizado com sucesso',
      product: updated[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Congelar/Descongelar produto (toggle is_active) (apenas admin)
app.patch('/products/:id/toggle-active', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (product.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const newStatus = !product[0].is_active;

    await pool.query('UPDATE products SET is_active = ? WHERE id = ?', [newStatus, req.params.id]);

    const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    res.json({
      message: `Produto ${newStatus ? 'ativado' : 'desativado'} com sucesso`,
      product: updated[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao alterar status do produto' });
  }
});

// Deletar produto (apenas admin)
app.delete('/products/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (product.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));


