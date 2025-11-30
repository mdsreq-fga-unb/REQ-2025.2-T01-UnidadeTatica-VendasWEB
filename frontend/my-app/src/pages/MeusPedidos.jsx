import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './css/MeusPedidos.css';
import { API_URL } from '../config';

const MeusPedidos = () => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      } else {
        console.error('Erro ao buscar pedidos');
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pendente': { icon: '⏳', text: 'Pendente', class: 'pendente' },
      'confirmado': { icon: '✅', text: 'Confirmado', class: 'confirmado' },
      'enviado': { icon: '🚚', text: 'Enviado', class: 'enviado' },
      'entregue': { icon: '📦', text: 'Entregue', class: 'entregue' },
      'cancelado': { icon: '❌', text: 'Cancelado', class: 'cancelado' }
    };
    
    const statusInfo = statusMap[status] || statusMap['pendente'];
    return (
      <span className={`pedido-status status-${statusInfo.class}`}>
        {statusInfo.icon} {statusInfo.text}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pedidos-page">
          <div className="pedidos-container">
            <h1>📦 Histórico de Pedidos</h1>
            <p>Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pedidos-page">
        <div className="pedidos-container">
          <h1>📦 Histórico de Pedidos</h1>

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
                      <h3>Pedido {pedido.order_id}</h3>
                      <p className="pedido-data">{new Date(pedido.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                    {getStatusBadge(pedido.status)}
                  </div>

                  <div className="pedido-items">
                    {pedido.items && pedido.items.map(item => (
                      <div key={item.id} className="pedido-item">
                        <div className="item-details">
                          <p className="item-name">{item.product_name}</p>
                          <p className="item-category">Categoria: {item.product_category}</p>
                          <p className="item-qty">Quantidade: {item.quantity}x</p>
                          <p className="item-price">Preço unitário: R$ {parseFloat(item.unit_price).toFixed(2)}</p>
                        </div>
                        <p className="item-subtotal">R$ {parseFloat(item.subtotal).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pedido-footer">
                    <p className="pedido-total">Total: R$ {parseFloat(pedido.total_amount).toFixed(2)}</p>
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
