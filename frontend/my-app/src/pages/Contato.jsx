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
    
    // Construir mensagem do WhatsApp
    let mensagem = `📝 *CONTATO SAC - UNIDADE TÁTICA*\n\n`;
    mensagem += `👤 *Nome:* ${formData.nome}\n`;
    mensagem += `📧 *Email:* ${formData.email}\n`;
    mensagem += `📞 *Telefone:* ${formData.telefone}\n`;
    mensagem += `📋 *Assunto:* ${formData.assunto}\n\n`;
    mensagem += `💬 *Mensagem:*\n${formData.mensagem}`;

    // Codificar mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // Número do WhatsApp da loja
    const numeroWhatsApp = '5561991427808';
    
    // Criar URL do WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    
    // Abrir WhatsApp em nova aba
    window.open(urlWhatsApp, '_blank');
    
    // Limpar formulário
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
            <h2>🎖️ Unidade Tática Militar</h2>
            <p className="info-subtitle">Equipamentos e Acessórios Táticos de Qualidade</p>
            
            <div className="info-item">
              <span className="icon">📍</span>
              <div>
                <h3>Endereço</h3>
                <p>Quadra I, Conjunto I-9, Lote 05</p>
                <p>Setor Militar - Planaltina/DF</p>
                <p className="referencia">Em frente ao Posto Ipiranga</p>
              </div>
            </div>
            
            <div className="info-item">
              <span className="icon">📞</span>
              <div>
                <h3>WhatsApp / Telefone</h3>
                <p>(61) 99142-7808</p>
                <a 
                  href="https://wa.me/5561991427808" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-link"
                >
                  💬 Iniciar conversa no WhatsApp
                </a>
              </div>
            </div>
            
            <div className="info-item">
              <span className="icon">📧</span>
              <div>
                <h3>Email</h3>
                <p>unidadetaticamilitaria@gmail.com</p>
                <a 
                  href="mailto:unidadetaticamilitaria@gmail.com"
                  className="email-link"
                >
                  ✉️ Enviar email
                </a>
              </div>
            </div>
            
            <div className="info-item">
              <span className="icon">⏰</span>
              <div>
                <h3>Horário de Atendimento</h3>
                <p><strong>Segunda a Sexta:</strong> 9h às 18h</p>
                <p><strong>Sábado:</strong> 9h às 13h</p>
                <p className="closed">Domingo e Feriados: Fechado</p>
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
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contato;
