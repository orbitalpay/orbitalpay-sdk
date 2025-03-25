import React from 'react';
import ProductCard from './ProductCard';

// Dummy product data
export const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 129.99,
    image: 'https://placehold.co/200x200?text=Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.'
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 249.99,
    image: 'https://placehold.co/200x200?text=SmartWatch',
    description: 'Track your fitness, receive notifications, and more with this sleek smart watch.'
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 79.99,
    image: 'https://placehold.co/200x200?text=Speaker',
    description: 'Portable waterproof speaker with amazing sound quality and 20-hour playtime.'
  },
  {
    id: 4,
    name: 'Laptop Backpack',
    price: 59.99,
    image: 'https://placehold.co/200x200?text=Backpack',
    description: 'Stylish, water-resistant backpack with padded compartments for your devices.'
  }
];

interface ProductListProps {
  onAddToCart: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  return (
    <div className="product-list">
      <h2>Featured Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            description={product.description}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList; 