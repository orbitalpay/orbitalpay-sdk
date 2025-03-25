import React from 'react';
import { products } from './ProductList';

export interface CartItem {
  productId: number;
  quantity: number;
}

interface CartItemWithDetails {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onCheckout: () => void;
  onRemoveItem: (id: number) => void;
}

const Cart: React.FC<CartProps> = ({ items, onCheckout, onRemoveItem }) => {
  const cartItems: CartItemWithDetails[] = items
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? {
        ...product,
        quantity: item.quantity
      } : null;
    })
    .filter((item): item is CartItemWithDetails => item !== null);

  const totalAmount = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="cart">
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p>${item.price.toFixed(2)} x {item.quantity}</p>
              <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button 
              onClick={() => onRemoveItem(item.id)} 
              className="remove-item-btn"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p className="cart-total">Total: ${totalAmount.toFixed(2)}</p>
        <button onClick={onCheckout} className="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart; 