import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logoUNDT from '../assets/logoUNDT.jpg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-camo-background"></div>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logoUNDT} alt="Unidade Tática Logo" className="logo-image" />
        </Link>

        {/* Menu de Navegação */}
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Início</Link>
          </li>
          <li className="navbar-item">
            <Link to="/geral" className="navbar-link">Geral</Link>
          </li>
          <li className="navbar-item">
            <Link to="/roupas" className="navbar-link">Roupas</Link>
          </li>
          <li className="navbar-item">
            <Link to="/calcados" className="navbar-link">Calçados</Link>
          </li>
          <li className="navbar-item">
            <Link to="/mochila" className="navbar-link">Mochilas</Link>
          </li>
          <li className="navbar-item">
            <Link to="/cutelaria" className="navbar-link">Cutelaria</Link>
          </li>
          <li className="navbar-item">
            <Link to="/bordados" className="navbar-link">Bordados</Link>
          </li>
          <li className="navbar-item">
            <Link to="/acessorios" className="navbar-link">Acessórios</Link>
          </li>
          <li className="navbar-item">
            <Link to="/contato" className="navbar-link">Contato</Link>
          </li>
        </ul>

        {/* Botões de Ação */}
        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/carrinho" className="btn-cart" title="Carrinho de Compras">
                🛒
                <span className="cart-badge">0</span>
              </Link>
              
              <div className="user-menu-container">
                <button 
                  className="btn-user-profile"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="user-icon">👤</span>
                  <span className="user-name">{user.name}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link to="/perfil" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <span>👤</span> Meu Perfil
                    </Link>
                    <Link to="/meus-pedidos" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <span>📦</span> Meus Pedidos
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                        <span>⚙️</span> Admin Panel
                      </Link>
                    )}
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <span>🚪</span> Sair
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/entrar" className="btn-entrar">Entrar</Link>
              <Link to="/cadastrar" className="btn-cadastrar">Cadastre-se</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
