import React from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  onAddToCart: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  description,
  onAddToCart
}) => {
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <h3>{name}</h3>
      <p className="product-price">${Number(price/1e6).toFixed(3)}</p>
      <p className="product-description">{description}</p>
      <button onClick={() => onAddToCart(id)} className="add-to-cart-btn">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard; 