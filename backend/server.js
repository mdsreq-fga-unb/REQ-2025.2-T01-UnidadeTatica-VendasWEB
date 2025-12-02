console.log("SERVER.JS rodando em:", import.meta.url);
import path from 'path';
import { fileURLToPath } from 'url';
console.log("Diretório atual:", path.dirname(fileURLToPath(import.meta.url)));


import dotenv from 'dotenv';
dotenv.config({ path: '.env', override: true });

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import app from './src/app.js';
import { pool } from './src/db.js';
import productRoutes, { setPool } from './src/routes/productRoutes.js';
import cartRoutes, { setPool as setCartPool } from './src/routes/cartRoutes.js';
import orderRoutes, { setPool as setOrderPool } from './src/routes/orderRoutes.js';
import { upload } from './src/config/cloudinary.js';

// Debug ENV
console.log("DEBUG ENV → DB_HOST:", process.env.DB_HOST);
console.log("DEBUG ENV → DB_USER:", process.env.DB_USER);
console.log("DEBUG ENV → DB_PASS:", process.env.DB_PASS);
console.log("DEBUG ENV → DB_NAME:", process.env.DB_NAME);
console.log("DEBUG ENV → CLOUDINARY:", process.env.CLOUDINARY_CLOUD_NAME ? '✅ Configurado' : '❌ Não configurado');

const JWT_SECRET = process.env.JWT_SECRET || 'unidade-tatica-secret-key-2025';

// Configurar pool nas rotas
setPool(pool);
setCartPool(pool);
setOrderPool(pool);

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
  const { 
    name, email, password, role = 'user',
    cpf, telefone, dataNascimento, cep, endereco, 
    numero, complemento, bairro, cidade, estado 
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  if (!cpf || !telefone || !dataNascimento || !cep || !endereco || !numero || !bairro || !cidade || !estado) {
    return res.status(400).json({ error: 'Todos os campos de cadastro são obrigatórios' });
  }

  try {
    // Verificar se email já existe
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Verificar se CPF já existe
    const cpfLimpo = cpf.replace(/\D/g, '');
    const [existingCpf] = await pool.query('SELECT id FROM users WHERE cpf = ?', [cpfLimpo]);
    if (existingCpf.length > 0) {
      return res.status(400).json({ error: 'CPF já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (
        name, email, password, role, cpf, telefone, data_nascimento, 
        cep, endereco, numero, complemento, bairro, cidade, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id`,
      [
        name, email, hashedPassword, role, cpfLimpo, 
        telefone.replace(/\D/g, ''), dataNascimento, cep.replace(/\D/g, ''), 
        endereco, numero, complemento || null, bairro, cidade, estado.toUpperCase()
      ]
    );

    const userId = result[0]?.id || result.insertId || result[0];
    
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user: { id: userId, name, email, role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('🔐 Tentativa de login:', { email });

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    console.log('📊 Executando query para buscar usuário...');
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('✅ Query executada, usuários encontrados:', users.length);

    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado com email:', email);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = users[0];
    console.log('👤 Usuário encontrado:', { id: user.id, email: user.email, role: user.role });

    console.log('🔑 Verificando senha...');
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('✅ Senha válida?', validPassword);
    
    if (!validPassword) {
      console.log('❌ Senha inválida');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    console.log('🎫 Gerando token JWT...');
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login bem-sucedido para:', email);
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
    console.error('❌ ERRO NO LOGIN:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ error: 'Erro ao fazer login', details: err.message });
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

// ============ GERENCIAMENTO DE USUÁRIOS ============

// Listar todos os usuários (Admin apenas)
app.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at, cpf, telefone, data_nascimento, cep, endereco, numero, complemento, bairro, cidade, estado FROM users ORDER BY created_at DESC'
    );

    res.json(users);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Deletar usuário (Admin apenas)
app.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Não permitir deletar o próprio usuário
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ error: 'Você não pode deletar sua própria conta' });
    }

    // Verificar se o usuário existe
    const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Deletar o usuário (cascade vai deletar pedidos e itens relacionados)
    const [deleteResult] = await pool.query('DELETE FROM users WHERE id = ? RETURNING id', [userId]);
    
    if (!deleteResult || deleteResult.length === 0) {
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

// ============ ROTAS DE PRODUTOS ============

// Rotas públicas de produtos
app.use('/', productRoutes);

// Criar produto (Admin apenas)
app.post('/products', authenticateToken, isAdmin, async (req, res) => {
  const { name, description, price, category, stock, image_url, is_active } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO products (name, description, price, category, stock, image_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       RETURNING id`,
      [name, description || null, price, category, stock || 0, image_url || null, is_active !== false]
    );

    const productId = result[0]?.id || result.insertId || result[0];
    
    res.status(201).json({
      message: 'Produto criado com sucesso',
      product: {
        id: productId,
        name,
        description,
        price,
        category,
        stock,
        image_url,
        is_active
      }
    });
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Atualizar produto (Admin apenas)
app.put('/products/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, stock, image_url, is_active } = req.body;

  console.log('📝 UPDATE PRODUTO - Dados recebidos:', {
    id,
    name,
    description,
    price,
    category,
    stock,
    image_url,
    is_active,
    is_active_type: typeof is_active
  });

  try {
    const [result] = await pool.query(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, category = ?, 
           stock = ?, image_url = ?, is_active = ?
       WHERE id = ?
       RETURNING id`,
      [name, description, price, category, stock, image_url, is_active, id]
    );

    console.log('✅ UPDATE PRODUTO - Resultado:', {
      resultLength: result?.length,
      result: result
    });

    if (!result || result.length === 0) {
      console.log('❌ UPDATE PRODUTO - Produto não encontrado');
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (err) {
    console.error('❌ Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto', details: err.message });
  }
});

// Deletar produto (Admin apenas)
app.delete('/products/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar se o produto existe
    const [checkResult] = await pool.query('SELECT id FROM products WHERE id = ?', [id]);
    
    if (!checkResult || checkResult.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Deletar o produto (CASCADE vai deletar cart_items e order_items automaticamente)
    const [deleteResult] = await pool.query('DELETE FROM products WHERE id = ? RETURNING id', [id]);
    
    if (!deleteResult || deleteResult.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado para deletar' });
    }

    res.json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ 
      error: 'Erro ao deletar produto',
      details: err.message 
    });
  }
});

// Ativar/Desativar produto (Admin apenas)
app.patch('/products/:id/toggle-active', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [products] = await pool.query('SELECT is_active FROM products WHERE id = ?', [id]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const newStatus = !products[0].is_active;
    
    const [updateResult] = await pool.query('UPDATE products SET is_active = ? WHERE id = ? RETURNING id', [newStatus, id]);
    
    if (!updateResult || updateResult.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado para atualizar' });
    }

    res.json({ 
      message: 'Status do produto atualizado',
      is_active: newStatus
    });
  } catch (err) {
    console.error('Erro ao alterar status do produto:', err);
    res.status(500).json({ error: 'Erro ao alterar status do produto' });
  }
});

// Upload de imagem de produto (Admin apenas) - Cloudinary
app.post('/api/upload', authenticateToken, isAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    console.log('📸 Imagem enviada para Cloudinary:', req.file.path);
    
    // O Cloudinary retorna a URL em req.file.path
    res.json({
      message: 'Imagem enviada com sucesso',
      imageUrl: req.file.path, // URL do Cloudinary
      filename: req.file.filename
    });
  } catch (err) {
    console.error('❌ Erro no upload:', err);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
  }
});

// Deletar imagem (Admin apenas)
app.delete('/api/upload/:filename', authenticateToken, isAdmin, (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'public/uploads', filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ message: 'Imagem deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Imagem não encontrada' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar imagem' });
  }
});

// ============ ROTAS DE CARRINHO ============

// Rotas de carrinho (autenticação obrigatória)
app.use('/cart', authenticateToken, cartRoutes);

// ============ ROTAS DE PEDIDOS ============

// Rotas de pedidos (autenticação obrigatória)
app.use('/orders', authenticateToken, orderRoutes);

// Listar todos os pedidos (Admin apenas)
app.get('/admin/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email, u.telefone as user_phone
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    // Buscar itens de cada pedido
    for (let order of orders) {
      const [items] = await pool.query(
        `SELECT * FROM order_items WHERE order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// Atualizar status do pedido (Admin apenas)
app.patch('/admin/orders/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const [updateResult] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ? RETURNING id',
      [status, orderId]
    );
    
    if (!updateResult || updateResult.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json({ message: 'Status atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

// Relatório de vendas (Admin apenas)
app.get('/admin/reports/sales', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let dateFilter = '';
    let params = [];
    
    if (month && year) {
      // PostgreSQL usa EXTRACT em vez de MONTH() e YEAR()
      dateFilter = 'WHERE EXTRACT(MONTH FROM o.created_at) = ? AND EXTRACT(YEAR FROM o.created_at) = ?';
      params = [month, year];
    } else if (year) {
      dateFilter = 'WHERE EXTRACT(YEAR FROM o.created_at) = ?';
      params = [year];
    }

    // Total de vendas (excluindo cancelados)
    const [totalSales] = await pool.query(
      `SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value
       FROM orders o
       ${dateFilter ? dateFilter + ' AND' : 'WHERE'} status != ?`,
      [...params, 'cancelado']
    );

    // Vendas por status (mostra todos, inclusive cancelados)
    const [salesByStatus] = await pool.query(
      `SELECT 
        status,
        COUNT(*) as count,
        SUM(total_amount) as revenue
       FROM orders o
       ${dateFilter}
       GROUP BY status
       ORDER BY 
         CASE status
           WHEN 'pendente' THEN 1
           WHEN 'confirmado' THEN 2
           WHEN 'enviado' THEN 3
           WHEN 'entregue' THEN 4
           WHEN 'cancelado' THEN 5
         END`,
      params
    );

    // Produtos mais vendidos (excluindo cancelados)
    const [topProducts] = await pool.query(
      `SELECT 
        oi.product_name,
        oi.product_category,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.subtotal) as total_revenue
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       ${dateFilter ? dateFilter + ' AND' : 'WHERE'} o.status != ?
       GROUP BY oi.product_id, oi.product_name, oi.product_category
       ORDER BY total_quantity DESC
       LIMIT 10`,
      [...params, 'cancelado']
    );

    // Vendas por categoria (excluindo cancelados)
    const [salesByCategory] = await pool.query(
      `SELECT 
        oi.product_category,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.subtotal) as total_revenue
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       ${dateFilter ? dateFilter + ' AND' : 'WHERE'} o.status != ?
       GROUP BY oi.product_category
       ORDER BY total_revenue DESC`,
      [...params, 'cancelado']
    );

    // Vendas diárias (últimos 30 dias ou do mês especificado, excluindo cancelados)
    const [dailySales] = await pool.query(
      `SELECT 
        DATE(o.created_at) as date,
        COUNT(*) as orders_count,
        SUM(o.total_amount) as revenue
       FROM orders o
       ${dateFilter ? dateFilter + ' AND' : 'WHERE'} o.status != ?
       GROUP BY DATE(o.created_at)
       ORDER BY date DESC
       LIMIT 30`,
      [...params, 'cancelado']
    );

    res.json({
      summary: totalSales[0],
      by_status: salesByStatus,
      top_products: topProducts,
      by_category: salesByCategory,
      daily_sales: dailySales
    });
  } catch (err) {
    console.error('Erro ao gerar relatório:', err);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});

// Contagem de novos pedidos pendentes (Admin apenas)
app.get('/admin/orders/pending/count', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT COUNT(*) as count FROM orders WHERE status = 'pendente'`
    );

    res.json({ pending_orders: result[0].count });
  } catch (err) {
    console.error('Erro ao contar pedidos pendentes:', err);
    res.status(500).json({ error: 'Erro ao contar pedidos pendentes' });
  }
});


const port = process.env.PORT || 4000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS allowed for: ${process.env.CORS_ORIGIN || 'localhost'}`);
});
