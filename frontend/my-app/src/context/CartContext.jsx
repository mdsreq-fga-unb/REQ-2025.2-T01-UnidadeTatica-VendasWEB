import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_URL } from '../config';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Buscar carrinho do servidor quando usuário estiver autenticado
  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      } else {
        console.error('Erro ao buscar carrinho');
        setCartItems([]);
      }
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Buscar carrinho quando o usuário logar
  useEffect(() => {
    if (user && token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user, token]);

  // Adicionar item ao carrinho
  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      alert('Você precisa estar logado para adicionar itens ao carrinho');
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Recarregar carrinho
        await fetchCart();
        return true;
      } else {
        alert(data.error || 'Erro ao adicionar ao carrinho');
        return false;
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar ao carrinho');
      return false;
    }
  };

  // Atualizar quantidade de um item
  const updateQuantity = async (itemId, quantity) => {
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();

      if (response.ok) {
        // Recarregar carrinho
        await fetchCart();
        return true;
      } else {
        alert(data.error || 'Erro ao atualizar quantidade');
        return false;
      }
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      alert('Erro ao atualizar quantidade');
      return false;
    }
  };

  // Remover item do carrinho
  const removeFromCart = async (itemId) => {
    if (!token) return false;

    try {
      console.log('🗑️ Removendo item do carrinho:', itemId);
      const response = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Resposta da remoção:', response.status);

      if (response.ok) {
        // Recarregar carrinho
        await fetchCart();
        console.log('✅ Item removido com sucesso');
        return true;
      } else {
        const errorData = await response.json();
        console.error('❌ Erro ao remover:', errorData);
        alert(errorData.error || 'Erro ao remover item do carrinho');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao remover item:', error);
      alert('Erro ao remover item do carrinho');
      return false;
    }
  };

  // Limpar carrinho
  const clearCart = async () => {
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCartItems([]);
        return true;
      } else {
        alert('Erro ao limpar carrinho');
        return false;
      }
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      alert('Erro ao limpar carrinho');
      return false;
    }
  };

  // Calcular total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);
  };

  // Contar total de itens
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    calculateTotal,
    getTotalItems,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
