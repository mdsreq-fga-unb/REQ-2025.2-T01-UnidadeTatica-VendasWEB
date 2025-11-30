import React from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    const success = await addToCart(product.id, 1);
    if (success) {
      alert(`${product.name} adicionado ao carrinho!`);
    }
  };

  return (
    <div className="product-card-shop">
      <div className="product-image-shop">
        <img 
          src={product.image_url || 'https://via.placeholder.com/300x300?text=Sem+Imagem'} 
          alt={product.name}
        />
        {product.stock === 0 && (
          <div className="out-of-stock-badge">ESGOTADO</div>
        )}
      </div>

      <div className="product-info-shop">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-price-container">
            <span className="product-price">R$ {parseFloat(product.price).toFixed(2)}</span>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="low-stock">Últimas unidades!</span>
            )}
          </div>

          <button 
            className="btn-add-to-cart"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? '❌ Indisponível' : '🛒 Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
