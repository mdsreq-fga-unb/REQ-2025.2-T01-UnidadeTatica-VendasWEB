import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProductsManagement.css';

const ProductsManagement = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'geral',
    stock: 0,
    image_url: '',
    is_active: true
  });

  const categories = [
    { value: 'geral', label: 'Geral' },
    { value: 'roupas', label: 'Roupas' },
    { value: 'calcados', label: 'Calçados' },
    { value: 'mochila', label: 'Mochila' },
    { value: 'cutelaria', label: 'Cutelaria' },
    { value: 'bordados', label: 'Bordados' },
    { value: 'acessorios', label: 'Acessórios' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingProduct
      ? `http://localhost:4000/products/${editingProduct.id}`
      : 'http://localhost:4000/products';

    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      });

      if (response.ok) {
        await fetchProducts();
        closeModal();
        alert(editingProduct ? 'Produto atualizado!' : 'Produto criado!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar produto');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
      image_url: product.image_url || '',
      is_active: product.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      const response = await fetch(`http://localhost:4000/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchProducts();
        alert('Produto deletado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar produto');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/products/${id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchProducts();
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status do produto');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'geral',
      stock: 0,
      image_url: '',
      is_active: true
    });
  };

  const getCategoryLabel = (value) => {
    return categories.find(cat => cat.value === value)?.label || value;
  };

  if (loading) {
    return <div className="loading">Carregando produtos...</div>;
  }

  return (
    <div className="products-management">
      <div className="products-header">
        <h2>Gerenciamento de Produtos</h2>
        <button className="btn-add-product" onClick={() => setShowModal(true)}>
          ➕ Adicionar Produto
        </button>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className={`product-card ${!product.is_active ? 'inactive' : ''}`}>
            <div className="product-image">
              <img src={product.image_url || 'https://via.placeholder.com/300x300?text=Sem+Imagem'} alt={product.name} />
              {!product.is_active && <div className="inactive-badge">INATIVO</div>}
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-category">{getCategoryLabel(product.category)}</p>
              <p className="product-description">{product.description}</p>
              
              <div className="product-details">
                <span className="product-price">R$ {parseFloat(product.price).toFixed(2)}</span>
                <span className="product-stock">Estoque: {product.stock}</span>
              </div>
            </div>

            <div className="product-actions">
              <button className="btn-edit" onClick={() => handleEdit(product)} title="Editar">
                ✏️
              </button>
              <button 
                className={`btn-toggle ${product.is_active ? 'active' : 'inactive'}`}
                onClick={() => handleToggleActive(product.id)}
                title={product.is_active ? 'Desativar' : 'Ativar'}
              >
                {product.is_active ? '❄️' : '🔥'}
              </button>
              <button className="btn-delete" onClick={() => handleDelete(product.id)} title="Deletar">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button className="btn-close" onClick={closeModal}>✖️</button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Nome do Produto *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Colete Tático Modular"
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Descrição detalhada do produto..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preço (R$) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Estoque</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Categoria *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} required>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>URL da Imagem</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  Produto Ativo
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {editingProduct ? 'Atualizar' : 'Criar'} Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
