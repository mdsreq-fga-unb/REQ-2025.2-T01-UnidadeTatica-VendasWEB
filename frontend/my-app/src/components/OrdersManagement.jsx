import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './OrdersManagement.css';
import { API_URL } from '../config';

const OrdersManagement = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchOrders();
    fetchPendingCount();
    // Atualizar contador de pendentes a cada 30 segundos
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/orders/pending/count', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingCount(data.pending_orders);
      }
    } catch (error) {
      console.error('Erro ao buscar contagem de pendentes:', error);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchOrders();
        await fetchPendingCount();
        alert('Status atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
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
      <span className={`status-badge status-${statusInfo.class}`}>
        {statusInfo.icon} {statusInfo.text}
      </span>
    );
  };

  if (loading) {
    return <div className="loading">Carregando pedidos...</div>;
  }

  return (
    <div className="orders-management">
      <div className="orders-header">
        <div>
          <h1>Gerenciamento de Pedidos</h1>
          <p>Visualize e gerencie todos os pedidos</p>
        </div>
        {pendingCount > 0 && (
          <div className="pending-alert">
            🔔 {pendingCount} pedido{pendingCount > 1 ? 's' : ''} pendente{pendingCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="orders-stats">
        <div className="stat-card">
          <h3>{orders.length}</h3>
          <p>Total de Pedidos</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(o => o.status === 'pendente').length}</h3>
          <p>Pendentes</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(o => o.status === 'confirmado').length}</h3>
          <p>Confirmados</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(o => o.status === 'enviado').length}</h3>
          <p>Enviados</p>
        </div>
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum pedido encontrado</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Pedido {order.order_id}</h3>
                  <p className="order-date">
                    {new Date(order.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="order-customer">
                <p><strong>Cliente:</strong> {order.user_name}</p>
                <p><strong>Email:</strong> {order.user_email}</p>
                {order.user_phone && <p><strong>Telefone:</strong> {order.user_phone}</p>}
              </div>

              <div className="order-items">
                <h4>Itens do Pedido:</h4>
                {order.items && order.items.map(item => (
                  <div key={item.id} className="order-item">
                    <span className="item-name">{item.product_name}</span>
                    <span className="item-qty">{item.quantity}x</span>
                    <span className="item-price">R$ {parseFloat(item.unit_price).toFixed(2)}</span>
                    <span className="item-subtotal">R$ {parseFloat(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total:</strong> R$ {parseFloat(order.total_amount).toFixed(2)}
                </div>
                <div className="order-actions">
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;
