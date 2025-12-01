import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './css/Carrinho.css';
import { API_URL } from '../config';

const Carrinho = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, calculateTotal, refreshCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PED${timestamp}${random}`;
  };

  const handleFinalizarCompra = async () => {
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    // Gerar ID do pedido
    const orderId = generateOrderId();
    
    try {
      // Criar pedido no backend
      const orderData = {
        order_id: orderId,
        total_amount: calculateTotal(),
        items: cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.name,
          product_category: item.category,
          quantity: item.quantity,
          unit_price: parseFloat(item.price),
          subtotal: parseFloat(item.price) * item.quantity
        }))
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Erro ao criar pedido');
      }

      // Construir mensagem do WhatsApp
      let mensagem = `🛒 *NOVO PEDIDO - ID: ${orderId}*\n\n`;
      mensagem += `👤 *Cliente:* ${user?.name || 'Não informado'}\n`;
      mensagem += `📧 *Email:* ${user?.email || 'Não informado'}\n\n`;
      mensagem += `📦 *Itens do Pedido:*\n`;
      mensagem += `━━━━━━━━━━━━━━━━━━━\n\n`;
      
      cartItems.forEach((item, index) => {
        mensagem += `${index + 1}. *${item.name}*\n`;
        mensagem += `   Categoria: ${item.category}\n`;
        mensagem += `   Quantidade: ${item.quantity}x\n`;
        mensagem += `   Preço unitário: R$ ${parseFloat(item.price).toFixed(2)}\n`;
        mensagem += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
      });
      
      mensagem += `━━━━━━━━━━━━━━━━━━━\n`;
      mensagem += `💰 *TOTAL: R$ ${calculateTotal().toFixed(2)}*\n\n`;
      mensagem += `Aguardo confirmação do pedido! 😊`;

      // Codificar mensagem para URL
      const mensagemCodificada = encodeURIComponent(mensagem);
      
      // Número do WhatsApp da loja
      const numeroWhatsApp = '5561991427808';
      
      // Criar URL do WhatsApp
      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
      
      // Abrir WhatsApp em nova aba
      window.open(urlWhatsApp, '_blank');
      
      // Atualizar carrinho após criar pedido (backend já limpou o carrinho)
      setTimeout(async () => {
        await refreshCart();
        alert('Pedido enviado! Seu carrinho foi limpo.');
        // Redirecionar para página de pedidos
        navigate('/meus-pedidos');
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      alert('Erro ao finalizar compra. Tente novamente.');
    }
  };

  const handleIncrement = async (item) => {
    await updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = async (item) => {
    if (item.quantity > 1) {
      await updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Deseja remover este item do carrinho?')) {
      await removeFromCart(itemId);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="carrinho-page">
          <div className="carrinho-container">
            <h1>🛒 Meu Carrinho</h1>
            <p>Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="carrinho-page">
        <div className="carrinho-container">
          <h1>🛒 Meu Carrinho</h1>

          {cartItems.length === 0 ? (
            <div className="carrinho-vazio">
              <span className="empty-icon">🛒</span>
              <h2>Seu carrinho está vazio</h2>
              <p>Adicione produtos para começar suas compras!</p>
              <Link to="/geral" className="btn-continuar-comprando">
                🔍 Explorar Produtos
              </Link>
            </div>
          ) : (
            <div className="carrinho-content">
              <div className="carrinho-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image_url} alt={item.name} className="item-image" />
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p className="item-category">{item.category}</p>
                      <p className="item-price">R$ {parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <div className="item-quantity">
                      <button className="qty-btn" onClick={() => handleDecrement(item)}>-</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => handleIncrement(item)}>+</button>
                    </div>
                    <div className="item-subtotal">
                      <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button className="btn-remove" onClick={() => handleRemove(item.id)}>🗑️</button>
                  </div>
                ))}
              </div>

              <div className="carrinho-resumo">
                <h2>Resumo do Pedido</h2>
                
                <div className="resumo-item">
                  <span>Subtotal:</span>
                  <span>R$ {calculateTotal().toFixed(2)}</span>
                </div>
                
                <div className="resumo-item">
                  <span>Frete:</span>
                  <span className="frete-gratis">GRÁTIS</span>
                </div>
                
                <hr className="resumo-divider" />
                
                <div className="resumo-total">
                  <span>Total:</span>
                  <span>R$ {calculateTotal().toFixed(2)}</span>
                </div>

                <button className="btn-finalizar" onClick={handleFinalizarCompra}>
                  ✅ Finalizar Compra via WhatsApp
                </button>

                <Link to="/geral" className="link-continuar">
                  ← Continuar Comprando
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Carrinho;
