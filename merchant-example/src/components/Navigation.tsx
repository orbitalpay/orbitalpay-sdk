import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { CartItem } from './Cart';

interface NavigationProps {
  cartItems: CartItem[];
}

const Navigation: React.FC<NavigationProps> = ({ cartItems }) => {
  const location = useLocation();
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Get page title based on current route
  const getPageTitle = () => {
    const baseTitle = (
      <>
        <span className="logo-orbital">Orbital</span>
        <span className="logo-shop">Shop</span>
      </>
    );
    
    switch (location.pathname) {
      case '/':
        return (
          <>
            {baseTitle}
            {/* <span className="page-suffix">Home</span> */}
          </>
        );
    
      case '/checkout':
        return (
          <>
            {baseTitle}
            {/* <span className="page-suffix">Checkout</span> */}
          </>
        );
      case '/transactions':
        return (
          <>
            {baseTitle}
            {/* <span className="page-suffix">Transactions</span> */}
          </>
        );
      default:
        return baseTitle;
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-logo">
        <Link to="/">{getPageTitle()}</Link>
      </div>
      
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
        <Link to="/transactions" className={`nav-link ${location.pathname === '/transactions' ? 'active' : ''}`}>
          Transactions
        </Link>
        <Link to="/checkout" className={`nav-link ${location.pathname === '/checkout' ? 'active' : ''}`}>
          Checkout
        </Link>
        <div className="cart-status">
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 