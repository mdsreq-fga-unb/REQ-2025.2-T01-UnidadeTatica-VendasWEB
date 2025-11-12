import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import './CategoryPage.css';

const CategoryPage = ({ category, title, description }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = category 
        ? `http://localhost:4000/products?category=${category}&active=true`
        : `http://localhost:4000/products?active=true`;
        
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError('Erro ao carregar produtos');
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="category-page">
        <div className="category-header">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {loading ? (
          <div className="loading-products">
            <div className="spinner"></div>
            <p>Carregando produtos...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={fetchProducts} className="btn-retry">
              Tentar Novamente
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <span>📦</span>
            <h2>Nenhum produto encontrado</h2>
            <p>Em breve teremos novidades nesta categoria!</p>
          </div>
        ) : (
          <div className="products-grid-shop">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
