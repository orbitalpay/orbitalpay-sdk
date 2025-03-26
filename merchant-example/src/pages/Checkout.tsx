"use client"
import React from 'react';
import { products } from '../components/ProductList';
import type { CartItem } from '../components/Cart';
import OrbitalPay from "orbital-pay-sdk";

interface CheckoutProps {
  cartItems: CartItem[];
  onOrderComplete: () => void;
}

interface CartItemWithDetails {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}
interface CheckoutSession {
  amount: number;
  callback_url: string;
  details: string;
  requester_wallet: string;
  status: string;
  timestamp: number;
  expiration_timestamp: number | null;
  token: string;
  transaction_id: string;
  txhash: string;
  type: string;
  email_linked: boolean;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems }) => {;
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<CheckoutSession | null>(null);
  const handleClose = () => {
    setOpen(false);
  };

  const items: CartItemWithDetails[] = cartItems
    .map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? {
        ...product,
        quantity: item.quantity
      } : null;
    })
    .filter((item): item is CartItemWithDetails => item !== null);

  const subtotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const tax = subtotal * 0.08; // 8% tax
  const shipping = 0.2; // Flat shipping fee
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, we would process payment here
    
    console.log(import.meta.env.VITE_ORBITAL_PRIVATE_KEY);
    const response = await fetch('https://py.api.orbitalpay.xyz/merchants/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ORBITAL_PRIVATE_KEY || '' // Replace with your actual API key
      },
      body: JSON.stringify({
        amount: Math.round(total*1e6),
        details: 'Merchant Example',
        token: 'USDC'
      })
    });

    if (!response.ok) {
      console.error('Failed to create checkout:', await response.text());
      return;
    }
    const data = await response.json();
    setData(data);
    console.log('Checkout created:', data);
    setOpen(true);
  };

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {items.map(item => (
              <div key={item.id} className="order-item">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div className="subtotal">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="tax">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="shipping">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="payment-details">
          <form onSubmit={handleSubmit}>
            <button type="submit" className="place-order-btn orbital-pay-btn">
              Pay With Orbital Pay
            </button>
          </form>
        </div>
        {open && (
          <OrbitalPay
            transaction_id={data?.transaction_id || ""}
            orbital_public_key={
              import.meta.env.VITE_ORBITAL_PUBLIC_KEY || ""
            }
            open={open}
            setStatus={(status: string) => {
              console.log(status);
            }}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout; 