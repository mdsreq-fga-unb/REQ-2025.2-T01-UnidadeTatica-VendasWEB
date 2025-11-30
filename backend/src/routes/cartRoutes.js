import express from 'express';

const router = express.Router();
let dbPool = null;

// Função para injetar o pool de conexão
export const setPool = (pool) => {
  dbPool = pool;
};

// GET /cart - Obter carrinho do usuário autenticado
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [items] = await dbPool.execute(
      `SELECT 
        ci.id,
        ci.quantity,
        p.id as product_id,
        p.name,
        p.description,
        p.price,
        p.category,
        p.image_url,
        p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND p.is_active = 1`,
      [userId]
    );
    
    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error);
    res.status(500).json({ error: 'Erro ao buscar carrinho' });
  }
});

// POST /cart - Adicionar item ao carrinho
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;
    
    if (!product_id || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }
    
    // Verificar se o produto existe e está ativo
    const [products] = await dbPool.execute(
      'SELECT id, stock FROM products WHERE id = ? AND is_active = 1',
      [product_id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    if (products[0].stock < quantity) {
      return res.status(400).json({ error: 'Estoque insuficiente' });
    }
    
    // Verificar se o item já está no carrinho
    const [existingItems] = await dbPool.execute(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );
    
    if (existingItems.length > 0) {
      // Atualizar quantidade
      const newQuantity = existingItems[0].quantity + quantity;
      
      if (products[0].stock < newQuantity) {
        return res.status(400).json({ error: 'Estoque insuficiente para esta quantidade' });
      }
      
      await dbPool.execute(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItems[0].id]
      );
      
      res.json({ message: 'Quantidade atualizada', id: existingItems[0].id });
    } else {
      // Adicionar novo item
      const [result] = await dbPool.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, product_id, quantity]
      );
      
      res.status(201).json({ message: 'Item adicionado ao carrinho', id: result.insertId });
    }
  } catch (error) {
    console.error('Erro ao adicionar ao carrinho:', error);
    res.status(500).json({ error: 'Erro ao adicionar ao carrinho' });
  }
});

// PUT /cart/:id - Atualizar quantidade de um item
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantidade inválida' });
    }
    
    // Verificar se o item pertence ao usuário
    const [items] = await dbPool.execute(
      `SELECT ci.id, p.stock 
       FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.id = ? AND ci.user_id = ?`,
      [itemId, userId]
    );
    
    if (items.length === 0) {
      return res.status(404).json({ error: 'Item não encontrado no carrinho' });
    }
    
    if (items[0].stock < quantity) {
      return res.status(400).json({ error: 'Estoque insuficiente' });
    }
    
    await dbPool.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, itemId]
    );
    
    res.json({ message: 'Quantidade atualizada' });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
});

// DELETE /cart/:id - Remover item do carrinho
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;
    
    const [result] = await dbPool.execute(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [itemId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item não encontrado no carrinho' });
    }
    
    res.json({ message: 'Item removido do carrinho' });
  } catch (error) {
    console.error('Erro ao remover item:', error);
    res.status(500).json({ error: 'Erro ao remover item' });
  }
});

// DELETE /cart - Limpar carrinho
router.delete('/', async (req, res) => {
  try {
    const userId = req.user.id;
    
    await dbPool.execute(
      'DELETE FROM cart_items WHERE user_id = ?',
      [userId]
    );
    
    res.json({ message: 'Carrinho limpo' });
  } catch (error) {
    console.error('Erro ao limpar carrinho:', error);
    res.status(500).json({ error: 'Erro ao limpar carrinho' });
  }
});

export default router;
