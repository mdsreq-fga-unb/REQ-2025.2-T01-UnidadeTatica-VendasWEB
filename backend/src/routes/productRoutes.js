import express from 'express';

const router = express.Router();

// Variável para armazenar o pool que será injetado
let pool;

// Função para configurar o pool
export const setPool = (dbPool) => {
  pool = dbPool;
};

// ============ ROTAS PÚBLICAS ============

// Listar todos os produtos ativos (com filtro opcional de categoria)
router.get('/products', async (req, res) => {
  const { category, active } = req.query;
  
  try {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    
    // Filtrar por categoria se fornecida
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    // Filtrar por ativo (padrão: apenas ativos)
    if (active !== 'false') {
      query += ' AND is_active = true';
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [products] = await pool.query(query, params);
    res.json(products);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Buscar produtos por categoria
router.get('/products/category/:category', async (req, res) => {
  const { category } = req.params;
  
  try {
    const [products] = await pool.query(
      'SELECT * FROM products WHERE category = ? AND is_active = true ORDER BY created_at DESC',
      [category]
    );
    res.json(products);
  } catch (err) {
    console.error('Erro ao buscar produtos por categoria:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Buscar produto específico por ID
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(products[0]);
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

export default router;
