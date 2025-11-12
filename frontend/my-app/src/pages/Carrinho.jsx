import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './css/Carrinho.css';

const Carrinho = () => {
  // Futuramente virá do contexto/estado global
  const cartItems = [];

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

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
                      <button className="qty-btn">-</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn">+</button>
                    </div>
                    <div className="item-subtotal">
                      <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button className="btn-remove">🗑️</button>
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

                <button className="btn-finalizar">
                  ✅ Finalizar Compra
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
