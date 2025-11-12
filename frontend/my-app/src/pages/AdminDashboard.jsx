import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductsManagement from '../components/ProductsManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/entrar');
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>🎖️ Admin Panel</h2>
          <p className="admin-name">{user?.name}</p>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <span>👥</span> Usuários
          </button>
          <button 
            className={`nav-item ${activeSection === 'products' ? 'active' : ''}`}
            onClick={() => setActiveSection('products')}
          >
            <span>📦</span> Produtos
          </button>
          <button className="nav-item">
            <span>🛒</span> Pedidos
          </button>
          <button className="nav-item">
            <span>📊</span> Relatórios
          </button>
          <button className="nav-item">
            <span>⚙️</span> Configurações
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-voltar" onClick={() => navigate('/')}>
            ← Voltar ao Site
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeSection === 'users' ? (
          <>
            <div className="content-header">
              <h1>Gerenciamento de Usuários</h1>
              <p>Visualize e gerencie todos os usuários do sistema</p>
            </div>

            {loading ? (
              <div className="loading">Carregando usuários...</div>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Tipo</th>
                      <th>Data de Cadastro</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td>
                          <strong>{u.name}</strong>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge badge-${u.role}`}>
                            {u.role === 'admin' ? '👑 Admin' : '👤 Usuário'}
                          </span>
                        </td>
                        <td>
                          {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '-'}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-action btn-edit" title="Editar">
                              ✏️
                            </button>
                            <button className="btn-action btn-delete" title="Excluir">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="stats-container">
              <div className="stat-card">
                <h3>Total de Usuários</h3>
                <p className="stat-number">{users.length}</p>
              </div>
              <div className="stat-card">
                <h3>Administradores</h3>
                <p className="stat-number">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="stat-card">
                <h3>Usuários Comuns</h3>
                <p className="stat-number">
                  {users.filter(u => u.role === 'user').length}
                </p>
              </div>
            </div>
          </>
        ) : activeSection === 'products' ? (
          <ProductsManagement />
        ) : (
          <div className="coming-soon">
            <h2>🚧 Em Desenvolvimento</h2>
            <p>Esta seção estará disponível em breve!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
