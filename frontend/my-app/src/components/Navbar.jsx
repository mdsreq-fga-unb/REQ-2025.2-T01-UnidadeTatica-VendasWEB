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
            <a href="#inicio" className="navbar-link">Início</a>
          </li>
          <li className="navbar-item">
            <a href="#geral" className="navbar-link">Geral</a>
          </li>
          <li className="navbar-item">
            <a href="#roupas" className="navbar-link">Roupas</a>
          </li>
          <li className="navbar-item">
            <a href="#calcados" className="navbar-link">Calçados</a>
          </li>
          <li className="navbar-item">
            <a href="#mochila" className="navbar-link">Mochila</a>
          </li>
          <li className="navbar-item">
            <a href="#cutelaria" className="navbar-link">Cutelaria</a>
          </li>
          <li className="navbar-item">
            <a href="#bordados" className="navbar-link">Bordados</a>
          </li>
          <li className="navbar-item">
            <a href="#acessorios" className="navbar-link">Acessórios</a>
          </li>
          <li className="navbar-item">
            <a href="#contato" className="navbar-link">Contato</a>
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
