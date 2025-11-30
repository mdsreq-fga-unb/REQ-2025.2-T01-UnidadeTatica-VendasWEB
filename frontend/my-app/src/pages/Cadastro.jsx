import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './css/Cadastro.css';

const Cadastro = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatação de CPF
    if (name === 'cpf') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }

    // Formatação de Telefone
    if (name === 'telefone') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }

    // Formatação de CEP
    if (name === 'cep') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        }));
      } else {
        alert('CEP não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      alert('Erro ao buscar CEP');
    } finally {
      setLoadingCep(false);
    }
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword ||
        !formData.cpf || !formData.telefone || !formData.dataNascimento || !formData.cep ||
        !formData.endereco || !formData.numero || !formData.bairro || !formData.cidade || !formData.estado) {
      setError('Todos os campos obrigatórios devem ser preenchidos');
      return false;
    }

    if (formData.name.length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres');
      return false;
    }

    if (!validarCPF(formData.cpf)) {
      setError('CPF inválido');
      return false;
    }

    const telefoneLimpo = formData.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10) {
      setError('Telefone inválido');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um email válido');
      return false;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }

    const cepLimpo = formData.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setError('CEP inválido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password, {
      cpf: formData.cpf,
      telefone: formData.telefone,
      dataNascimento: formData.dataNascimento,
      cep: formData.cep,
      endereco: formData.endereco,
      numero: formData.numero,
      complemento: formData.complemento,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado
    });

    if (result.success) {
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/entrar');
    } else {
      setError(result.error || 'Erro ao realizar cadastro');
    }

    setLoading(false);
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-box">
        <div className="cadastro-header">
          <h1>🎖️ Criar Conta</h1>
          <p>Junte-se à Unidade Tática</p>
        </div>

        <form onSubmit={handleSubmit} className="cadastro-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cpf">CPF *</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                maxLength="14"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone *</label>
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                maxLength="15"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dataNascimento">Data de Nascimento *</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
            />
          </div>

          <div className="form-divider">
            <span>Endereço</span>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label htmlFor="cep">CEP *</label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                onBlur={(e) => buscarCep(e.target.value)}
                placeholder="00000-000"
                maxLength="9"
              />
              {loadingCep && <small style={{ color: '#8b7d6b' }}>Buscando CEP...</small>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="numero">Número *</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="123"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço *</label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Rua, Avenida, etc"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="complemento">Complemento</label>
              <input
                type="text"
                id="complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                placeholder="Apto, Bloco, etc"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bairro">Bairro *</label>
              <input
                type="text"
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                placeholder="Nome do bairro"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 3 }}>
              <label htmlFor="cidade">Cidade *</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Nome da cidade"
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="estado">UF *</label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                placeholder="SP"
                maxLength="2"
                style={{ textTransform: 'uppercase' }}
              />
            </div>
          </div>

          <div className="form-divider">
            <span>Segurança</span>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Digite a senha novamente"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn-cadastro" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Criar Conta'}
          </button>

          <div className="cadastro-footer">
            <p>
              Já tem uma conta?{' '}
              <Link to="/entrar" className="link-login">Faça login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
