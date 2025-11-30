import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ReportsManagement.css';
import { API_URL } from '../config';

const ReportsManagement = () => {
  const { token } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReport();
  }, [month, year]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/admin/reports/sales?month=${month}&year=${year}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReport(data);
      }
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  if (loading) {
    return <div className="loading">Carregando relatórios...</div>;
  }

  return (
    <div className="reports-management">
      <div className="reports-header">
        <div>
          <h1>Relatórios de Vendas</h1>
          <p>Análise detalhada do desempenho de vendas</p>
        </div>
        <div className="period-selector">
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {monthNames.map((name, index) => (
              <option key={index} value={index + 1}>{name}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {report && (
        <>
          <div className="summary-cards">
            <div className="summary-card revenue">
              <h3>Faturamento Total</h3>
              <p className="value">R$ {parseFloat(report.summary.total_revenue || 0).toFixed(2)}</p>
              <span className="subtitle">{report.summary.total_orders || 0} pedidos</span>
            </div>
            <div className="summary-card average">
              <h3>Ticket Médio</h3>
              <p className="value">R$ {parseFloat(report.summary.average_order_value || 0).toFixed(2)}</p>
              <span className="subtitle">Por pedido</span>
            </div>
          </div>

          <div className="reports-grid">
            {/* Status dos Pedidos */}
            <div className="report-card">
              <h3>Pedidos por Status</h3>
              <div className="status-chart">
                {report.by_status && report.by_status.length > 0 ? (
                  report.by_status.map(item => (
                    <div key={item.status} className="status-item">
                      <div className="status-label">
                        <span className={`status-badge status-${item.status}`}>
                          {item.status}
                        </span>
                        <span className="status-count">{item.count} pedidos</span>
                      </div>
                      <div className="status-revenue">
                        R$ {parseFloat(item.revenue).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty">Nenhum pedido neste período</p>
                )}
              </div>
            </div>

            {/* Produtos Mais Vendidos */}
            <div className="report-card">
              <h3>Top 10 Produtos Mais Vendidos</h3>
              <div className="products-table">
                {report.top_products && report.top_products.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Categoria</th>
                        <th>Qtd</th>
                        <th>Receita</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.top_products.map((product, index) => (
                        <tr key={index}>
                          <td>{product.product_name}</td>
                          <td>{product.product_category}</td>
                          <td>{product.total_quantity}</td>
                          <td>R$ {parseFloat(product.total_revenue).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="empty">Nenhuma venda neste período</p>
                )}
              </div>
            </div>

            {/* Vendas por Categoria */}
            <div className="report-card">
              <h3>Vendas por Categoria</h3>
              <div className="category-chart">
                {report.by_category && report.by_category.length > 0 ? (
                  report.by_category.map((cat, index) => (
                    <div key={index} className="category-item">
                      <div className="category-info">
                        <strong>{cat.product_category}</strong>
                        <span>{cat.total_quantity} unidades</span>
                      </div>
                      <div className="category-revenue">
                        R$ {parseFloat(cat.total_revenue).toFixed(2)}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty">Nenhuma venda neste período</p>
                )}
              </div>
            </div>

            {/* Vendas Diárias */}
            <div className="report-card">
              <h3>Vendas Diárias (Últimos 30 dias)</h3>
              <div className="daily-sales">
                {report.daily_sales && report.daily_sales.length > 0 ? (
                  report.daily_sales.map((day, index) => (
                    <div key={index} className="daily-item">
                      <span className="daily-date">
                        {new Date(day.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="daily-orders">{day.orders_count} pedidos</span>
                      <span className="daily-revenue">
                        R$ {parseFloat(day.revenue).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="empty">Nenhuma venda neste período</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsManagement;
