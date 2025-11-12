import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './css/Perfil.css';

const Perfil = () => {
  const { user, token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validação de senha
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem!' });
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch(`http://localhost:4000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        setEditing(false);
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao atualizar perfil' });
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    }
  };

  return (
    <>
      <Navbar />
      <div className="perfil-page">
        <div className="perfil-container">
          <div className="perfil-header">
            <div className="perfil-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <h1>Meu Perfil</h1>
            <p className="perfil-role">
              {user?.role === 'admin' ? '👑 Administrador' : '👤 Usuário'}
            </p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.type === 'success' ? '✅' : '⚠️'} {message.text}
            </div>
          )}

          <div className="perfil-content">
            <div className="perfil-info-card">
              <h2>Informações da Conta</h2>
              
              {!editing ? (
                <div className="info-display">
                  <div className="info-item">
                    <label>Nome Completo</label>
                    <p>{user?.name}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>{user?.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Tipo de Conta</label>
                    <p>{user?.role === 'admin' ? 'Administrador' : 'Usuário Padrão'}</p>
                  </div>
                  <div className="info-item">
                    <label>Membro desde</label>
                    <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}</p>
                  </div>

                  <button className="btn-edit" onClick={() => setEditing(true)}>
                    ✏️ Editar Perfil
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="edit-form">
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <hr className="form-divider" />
                  <h3>Alterar Senha (Opcional)</h3>

                  <div className="form-group">
                    <label>Senha Atual</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Digite sua senha atual"
                    />
                  </div>

                  <div className="form-group">
                    <label>Nova Senha</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Digite a nova senha"
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirmar Nova Senha</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirme a nova senha"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setMessage({ type: '', text: '' });
                    }}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-save">
                      💾 Salvar Alterações
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="perfil-stats-card">
              <h2>Estatísticas</h2>
              <div className="stat-item">
                <span className="stat-icon">📦</span>
                <div className="stat-info">
                  <p className="stat-label">Total de Pedidos</p>
                  <p className="stat-value">0</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">✅</span>
                <div className="stat-info">
                  <p className="stat-label">Pedidos Concluídos</p>
                  <p className="stat-value">0</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🚚</span>
                <div className="stat-info">
                  <p className="stat-label">Pedidos em Andamento</p>
                  <p className="stat-value">0</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💰</span>
                <div className="stat-info">
                  <p className="stat-label">Total Gasto</p>
                  <p className="stat-value">R$ 0,00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Perfil;
