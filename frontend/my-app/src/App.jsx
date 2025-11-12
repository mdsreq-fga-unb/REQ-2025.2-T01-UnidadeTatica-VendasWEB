import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminRoute, PrivateRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Geral from './pages/Geral';
import Roupas from './pages/Roupas';
import Calcados from './pages/Calcados';
import Mochila from './pages/Mochila';
import Cutelaria from './pages/Cutelaria';
import Bordados from './pages/Bordados';
import Acessorios from './pages/Acessorios';
import Contato from './pages/Contato';
import Perfil from './pages/Perfil';
import Carrinho from './pages/Carrinho';
import MeusPedidos from './pages/MeusPedidos';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/geral" element={<Geral />} />
          <Route path="/roupas" element={<Roupas />} />
          <Route path="/calcados" element={<Calcados />} />
          <Route path="/mochila" element={<Mochila />} />
          <Route path="/cutelaria" element={<Cutelaria />} />
          <Route path="/bordados" element={<Bordados />} />
          <Route path="/acessorios" element={<Acessorios />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/entrar" element={<Login />} />
          
          {/* Rotas Protegidas - Requerem Login */}
          <Route 
            path="/perfil" 
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/carrinho" 
            element={
              <PrivateRoute>
                <Carrinho />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/meus-pedidos" 
            element={
              <PrivateRoute>
                <MeusPedidos />
              </PrivateRoute>
            } 
          />
          
          {/* Rota Admin - Requer Login + Role Admin */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
