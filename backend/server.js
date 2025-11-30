console.log("SERVER.JS rodando em:", import.meta.url);
import path from 'path';
import { fileURLToPath } from 'url';
console.log("Diretório atual:", path.dirname(fileURLToPath(import.meta.url)));


import dotenv from 'dotenv';
dotenv.config({ path: '.env', override: true });

import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from './src/app.js';

// Debug ENV
console.log("DEBUG ENV → DB_HOST:", process.env.DB_HOST);
console.log("DEBUG ENV → DB_USER:", process.env.DB_USER);
console.log("DEBUG ENV → DB_PASS:", process.env.DB_PASS);
console.log("DEBUG ENV → DB_NAME:", process.env.DB_NAME);

const JWT_SECRET = process.env.JWT_SECRET || 'unidade-tatica-secret-key-2025';

// Conexão pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// ===== Middleware de Autenticação =====
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

// Checar admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// ===== Rotas =====

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/', (req, res) => {
  res.send('Backend Unidade Tática está funcionando! 🚀');
});

// ============ AUTENTICAÇÃO ============

// Registro
app.post('/auth/register', async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

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

// Buscar dados do usuário autenticado
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
    res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
  }
});


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
