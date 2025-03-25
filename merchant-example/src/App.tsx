import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import ProductList from './components/ProductList'
import Cart, { CartItem } from './components/Cart'
import Checkout from './pages/Checkout'
import TransactionHistory from './pages/TransactionHistory'

// Wrapper component to provide navigation
const AppContent = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const navigate = useNavigate();

  const handleAddToCart = (productId: number) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(item => item.productId === productId)
      
      if (existingItem) {
        // Increase quantity if item exists
        return prevItems.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      } else {
        // Add new item with quantity 1
        return [...prevItems, { productId, quantity: 1 }]
      }
    })
  }

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.productId !== productId)
    )
  }

  const handleOrderComplete = () => {
    setCartItems([])
  }

  const handleCheckout = () => {
    navigate('/checkout');
  }

  return (
    <div className="app">
      <Navigation cartItems={cartItems} />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <div className="shop">
              <ProductList onAddToCart={handleAddToCart} />
              <Cart 
                items={cartItems} 
                onCheckout={handleCheckout} 
                onRemoveItem={handleRemoveFromCart} 
              />
            </div>
          } />
          
          <Route path="/checkout" element={
            <Checkout 
              cartItems={cartItems} 
              onOrderComplete={handleOrderComplete} 
            />
          } />
          
          <Route path="/transactions" element={<TransactionHistory />} />
        </Routes>
      </main>
      
      <footer className="footer">
        <p>&copy; 2023 OrbitalShop. All rights reserved.</p>
      </footer>
    </div>
  )
}

// Main App component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
