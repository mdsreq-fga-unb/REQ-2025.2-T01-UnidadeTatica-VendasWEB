import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      console.log('🔍 Buscando dados do usuário com token:', token);
      const response = await fetch('http://localhost:4000/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Resposta do servidor:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Dados do usuário recebidos:', userData);
        setUser(userData);
      } else {
        console.log('❌ Erro ao buscar usuário, fazendo logout');
        logout();
      }
    } catch (error) {
      console.error('❌ Erro ao buscar dados do usuário:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Tentando login com:', email);
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('📡 Resposta do login:', response.status, data);

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        console.log('✅ Login bem-sucedido:', data.user);
        return { success: true, user: data.user };
      } else {
        console.log('❌ Falha no login:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('❌ Erro ao fazer login:', error);
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
