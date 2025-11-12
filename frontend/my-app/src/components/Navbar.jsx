import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logoUNDT from '../assets/logoUNDT.jpg';

const Navbar = () => {
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
          <Link to="/entrar" className="btn-entrar">Entrar</Link>
          <a href="#cadastrar" className="btn-cadastrar">Cadastre-se</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
