import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import logoVetorizada from '../assets/logovetorizada.png';
import './css/Home.css';
import { API_URL } from '../config';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products');
      if (response.ok) {
        const data = await response.json();
        // Pegar apenas os 8 primeiros produtos
        setProducts(data.slice(0, 8));
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Bem-vindo à Unidade Tática
            </h1>
            <p className="hero-subtitle">
              Equipamentos táticos e profissionais de elite
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-section">
          <div className="container">
            <h2 className="section-title">Produtos em Destaque</h2>
            
            {loading ? (
              <div className="loading-products">
                <p>Carregando produtos...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <p>Nenhum produto disponível no momento.</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div className="view-all-container">
                  <Link to="/geral" className="btn-view-all">
                    Ver Todos os Produtos →
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Unidade Tática - E-commerce. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
