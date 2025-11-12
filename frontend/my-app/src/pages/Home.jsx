import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import logoVetorizada from '../assets/logovetorizada.png';
import './css/Home.css';

function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  return (
    <div className="app">
      <Navbar />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <img src={logoVetorizada} alt="Unidade Tática" className="hero-logo" />
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
            
            <div className="products-grid">
              {/* Placeholder para produtos - será implementado posteriormente */}
              <div className="product-placeholder">
                <p>Produtos serão carregados aqui...</p>
              </div>
            </div>
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
