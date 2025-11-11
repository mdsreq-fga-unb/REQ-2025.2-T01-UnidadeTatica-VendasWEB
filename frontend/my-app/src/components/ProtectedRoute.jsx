import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '1.2rem',
        color: '#605C5C'
      }}>
        Carregando...
      </div>
    );
  }

  return user ? children : <Navigate to="/entrar" />;
};

export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '1.2rem',
        color: '#605C5C'
      }}>
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/entrar" />;
  }

  if (!isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};
