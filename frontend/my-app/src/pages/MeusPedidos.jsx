import React from 'react';
import Navbar from '../components/Navbar';
import './css/MeusPedidos.css';

const MeusPedidos = () => {
  // Futuramente virá da API
  const pedidos = [];

  return (
    <>
      <Navbar />
      <div className="pedidos-page">
        <div className="pedidos-container">
          <h1>📦 Meus Pedidos</h1>

          {pedidos.length === 0 ? (
            <div className="pedidos-vazio">
              <span className="empty-icon">📦</span>
              <h2>Nenhum pedido realizado</h2>
              <p>Você ainda não fez nenhuma compra. Que tal começar agora?</p>
            </div>
          ) : (
            <div className="pedidos-lista">
              {pedidos.map(pedido => (
                <div key={pedido.id} className="pedido-card">
                  <div className="pedido-header">
                    <div className="pedido-info">
                      <h3>Pedido #{pedido.id}</h3>
                      <p className="pedido-data">{new Date(pedido.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <span className={`pedido-status status-${pedido.status}`}>
                      {pedido.status === 'pending' && '⏳ Pendente'}
                      {pedido.status === 'processing' && '🔄 Processando'}
                      {pedido.status === 'shipped' && '🚚 Enviado'}
                      {pedido.status === 'delivered' && '✅ Entregue'}
                      {pedido.status === 'cancelled' && '❌ Cancelado'}
                    </span>
                  </div>

                  <div className="pedido-items">
                    {pedido.items.map(item => (
                      <div key={item.id} className="pedido-item">
                        <img src={item.product.image_url} alt={item.product.name} />
                        <div className="item-details">
                          <p className="item-name">{item.product.name}</p>
                          <p className="item-qty">Quantidade: {item.quantity}</p>
                        </div>
                        <p className="item-price">R$ {parseFloat(item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pedido-footer">
                    <p className="pedido-total">Total: R$ {parseFloat(pedido.total).toFixed(2)}</p>
                    <button className="btn-detalhes">Ver Detalhes</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MeusPedidos;
