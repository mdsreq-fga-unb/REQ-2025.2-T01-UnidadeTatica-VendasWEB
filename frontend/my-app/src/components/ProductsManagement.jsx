import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProductsManagement.css';
import { API_URL } from '../config';

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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
      const response = await fetch(`${API_URL}/products`);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }

      setImageFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao fazer upload da imagem');
        return null;
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fazer upload da imagem se houver arquivo selecionado
    let imageUrl = formData.image_url;
    if (imageFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        return; // Abortar se o upload falhar
      }
    }

    const url = editingProduct
      ? `${API_URL}/products/${editingProduct.id}`
      : `${API_URL}/products`;

    const method = editingProduct ? 'PUT' : 'POST';

    const payload = {
      ...formData,
      image_url: imageUrl,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    console.log('📤 Enviando dados do produto:', {
      method,
      url,
      editingProduct: editingProduct?.id,
      payload
    });

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log('📡 Resposta do servidor:', {
        status: response.status,
        ok: response.ok
      });

      if (response.ok) {
        await fetchProducts();
        closeModal();
        alert(editingProduct ? 'Produto atualizado!' : 'Produto criado!');
      } else {
        const error = await response.json();
        console.error('❌ Erro na resposta:', error);
        alert(error.error || 'Erro ao salvar produto');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar produto:', error);
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
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchProducts();
        alert('Produto deletado com sucesso!');
      } else {
        const error = await response.json();
        console.error('Erro na resposta:', error);
        alert(error.error || error.details || 'Erro ao deletar produto');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar produto: ' + error.message);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}/toggle-active`, {
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
    setImageFile(null);
    setImagePreview(null);
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
                <label>Imagem do Produto</label>
                <div className="image-upload-section">
                  <div className="upload-option">
                    <label className="file-input-label">
                      📁 Escolher Arquivo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                    {imageFile && <span className="file-name">✅ {imageFile.name}</span>}
                  </div>
                  
                  <div className="upload-divider">
                    <span>OU</span>
                  </div>
                  
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="Cole a URL da imagem aqui"
                    className="url-input"
                  />
                </div>

                {(imagePreview || formData.image_url) && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview || formData.image_url} 
                      alt="Preview" 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150?text=Erro+ao+carregar';
                      }}
                    />
                  </div>
                )}
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
                <button type="submit" className="btn-save" disabled={uploadingImage}>
                  {uploadingImage ? '⏳ Enviando...' : (editingProduct ? 'Atualizar' : 'Criar')} Produto
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
