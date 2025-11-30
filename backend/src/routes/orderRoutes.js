import express from 'express';

const router = express.Router();
let dbPool = null;

// Função para injetar o pool de conexão
export const setPool = (pool) => {
  dbPool = pool;
};

// POST /orders - Criar novo pedido
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { order_id, items, total_amount } = req.body;

    console.log('📦 Criando pedido:', { userId, order_id, items_count: items?.length, total_amount });

    if (!order_id || !items || !Array.isArray(items) || items.length === 0 || !total_amount) {
      return res.status(400).json({ error: 'Dados do pedido inválidos' });
    }

    try {
      // Criar o pedido (sem transação para simplificar - PostgreSQL não suporta da mesma forma)
      const [orderResult] = await dbPool.query(
        `INSERT INTO orders (order_id, user_id, total_amount, status, whatsapp_sent) 
         VALUES (?, ?, ?, ?, ?)
         RETURNING id`,
        [order_id, userId, total_amount, 'pendente', true]
      );

      const orderId = orderResult[0]?.id || orderResult.insertId;
      console.log('✅ Pedido criado com ID:', orderId);

      // Inserir itens do pedido
      for (const item of items) {
        await dbPool.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_category, quantity, unit_price, subtotal)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.product_id,
            item.product_name,
            item.product_category,
            item.quantity,
            item.unit_price,
            item.subtotal
          ]
        );

        // Atualizar estoque do produto
        await dbPool.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Limpar carrinho do usuário
      await dbPool.query(
        'DELETE FROM cart_items WHERE user_id = ?',
        [userId]
      );

      console.log('✅ Pedido finalizado com sucesso');

      res.status(201).json({
        message: 'Pedido criado com sucesso',
        order_id: order_id,
        id: orderId
      });
    } catch (error) {
      console.error('❌ Erro ao processar pedido:', error);
      throw error;
    }
  } catch (error) {
    console.error('❌ Erro ao criar pedido:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Erro ao criar pedido', details: error.message });
  }
});

// GET /orders - Listar pedidos do usuário autenticado
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await dbPool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    // Buscar itens de cada pedido
    for (let order of orders) {
      const [items] = await dbPool.query(
        `SELECT * FROM order_items WHERE order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// GET /orders/:id - Buscar pedido específico
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const [orders] = await dbPool.query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ? AND o.user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const order = orders[0];

    // Buscar itens do pedido
    const [items] = await dbPool.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [order.id]
    );

    order.items = items;

    res.json(order);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
});

export default router;
