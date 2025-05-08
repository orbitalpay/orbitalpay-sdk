"use client"
import React from 'react';
import { products } from '../components/ProductList';
import type { CartItem } from '../components/Cart';
import OrbitalPay from "@orbitalpay/sdk";

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
  const [status, setStatus] = React.useState<string | null>(null);
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
  const shipping = 40000; // Flat shipping fee
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if data is not null, then we need to update the data
    if(!data ){
    const response = await fetch('https://py.api.orbitalpay.xyz/merchants/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ORBITAL_PRIVATE_KEY || '' // Replace with your actual API key
      },
      body: JSON.stringify({
        amount: Number(total),
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
   }
    console.log('Checkout created:', data);
    setOpen(true);
  };

  const getStatusMessage = (status: string | null) => {
    switch (status) {
      case 'paid':
        return {
          message: 'Payment completed successfully!',
          className: 'status-paid'
        };
      case 'pending':
        return {
          message: 'Payment is pending...',
          className: 'status-pending'
        };
      case 'expired':
        return {
          message: 'Payment session expired',
          className: 'status-expired'
        };
      case 'cancelled':
        return {
          message: 'Payment was cancelled',
          className: 'status-cancelled'
        };
      default:
        return {
          message: '',
          className: ''
        };
    }
  };

  console.log(import.meta.env.VITE_ORBITAL_PUBLIC_KEY);

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {items.map(item => (
              <div key={item.id} className="order-item">
                <span>{item.name} x {item.quantity}</span>
                <span>${Number((item.price * item.quantity)/1e6).toFixed(3)}</span>
              </div>
            ))}
          </div>
          <div className="order-totals">
            <div className="subtotal">
              <span>Subtotal</span>
              <span>${Number(subtotal/1e6).toFixed(3)}</span>
            </div>
            <div className="tax">
              <span>Tax (8%)</span>
              <span>${Number(tax/1e6).toFixed(3)}</span>
            </div>
            <div className="shipping">
              <span>Shipping</span>
              <span>${Number(shipping/1e6).toFixed(3)}</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>${Number(total/1e6).toFixed(3)}</span>
            </div>
          </div>
        </div>

        <div className="payment-details">
          <form onSubmit={handleSubmit}>
            <button type="submit" className="place-order-btn orbital-pay-btn">
              Pay With Orbital Pay
            </button>
          </form>
          {status && (
          <div className={`status-container ${getStatusMessage(status).className}`}>
            <span className="status-message">
              {getStatusMessage(status).message}
            </span>
          </div>
        )}
        </div>
        {open && (
          <OrbitalPay
            transaction_id={data?.transaction_id || ""}
            orbital_public_key={
              import.meta.env.VITE_ORBITAL_PUBLIC_KEY || ""
            }
            open={open}
            setStatus={setStatus}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout; 