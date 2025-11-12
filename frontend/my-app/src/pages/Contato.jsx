import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './css/Contato.css';

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mensagem enviada! Em breve entraremos em contato.');
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      assunto: '',
      mensagem: ''
    });
  };

  return (
    <>
      <Navbar />
      <div className="contato-page">
        <div className="contato-header">
          <h1>Entre em Contato</h1>
          <p>Estamos aqui para ajudar! Envie sua mensagem ou dúvida.</p>
        </div>

        <div className="contato-content">
          <div className="contato-info">
            <h2>🎖️ Unidade Tática</h2>
            <div className="info-item">
              <span className="icon">📍</span>
              <div>
                <h3>Endereço</h3>
                <p>Brasília - DF, Brasil</p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">📞</span>
              <div>
                <h3>Telefone</h3>
                <p>(61) 9999-9999</p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">📧</span>
              <div>
                <h3>Email</h3>
                <p>contato@unidadetatica.com</p>
              </div>
            </div>
            <div className="info-item">
              <span className="icon">⏰</span>
              <div>
                <h3>Horário de Atendimento</h3>
                <p>Segunda a Sexta: 9h às 18h</p>
                <p>Sábado: 9h às 13h</p>
              </div>
            </div>
          </div>

          <form className="contato-form" onSubmit={handleSubmit}>
            <h2>Envie sua Mensagem</h2>
            
            <div className="form-group">
              <label htmlFor="nome">Nome Completo *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Digite seu nome"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="seu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="assunto">Assunto *</label>
              <select
                id="assunto"
                name="assunto"
                value={formData.assunto}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um assunto</option>
                <option value="duvida">Dúvida sobre Produtos</option>
                <option value="pedido">Informações de Pedido</option>
                <option value="orcamento">Solicitação de Orçamento</option>
                <option value="sugestao">Sugestão</option>
                <option value="reclamacao">Reclamação</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mensagem">Mensagem *</label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Digite sua mensagem aqui..."
              ></textarea>
            </div>

            <button type="submit" className="btn-enviar">
              📨 Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contato;
