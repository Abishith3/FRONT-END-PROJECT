import { useState, useEffect, useMemo } from 'react';
import './App.css';

// Import local data and components
import { products as initialProducts } from './data/products';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import SupportModal from './components/SupportModal';

// Icons for layout decorations
import { Star, CheckCircle, RotateCcw, AlertTriangle, Phone } from 'lucide-react';

const CATEGORIES = ["Mobiles & Tablets", "Laptops & Accessories", "Fashion & Apparel", "Home & Living", "Fitness & Sports"];
const PAGINATION_STEP = 12;

export default function App() {
  // --- States ---
  
  // Store products in state so session reviews persist
  const [productsList, setProductsList] = useState(() => {
    const saved = localStorage.getItem('abishith_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Cart state persisted to localStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('abishith_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Dark Mode state persisted
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('abishith_dark_mode');
    if (saved) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(55000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');

  // UI state controls
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGINATION_STEP);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  // --- Effects ---
  
  // Save products when updated
  useEffect(() => {
    localStorage.setItem('abishith_products', JSON.stringify(productsList));
  }, [productsList]);

  // Save cart when updated
  useEffect(() => {
    localStorage.setItem('abishith_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('abishith_dark_mode', isDarkMode);
  }, [isDarkMode]);

  // If a modal/drawer is open, lock body scrolling
  useEffect(() => {
    if (selectedProduct || isCartOpen || showCheckoutSuccess || isSupportOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProduct, isCartOpen, showCheckoutSuccess, isSupportOpen]);

  // --- Callbacks ---

  const handleToggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Cart operations
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId, count) => {
    if (count <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) => 
      prevCart.map((item) => item.id === productId ? { ...item, quantity: count } : item)
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleCheckoutSuccess = () => {
    setCart([]);
    setIsCartOpen(false);
    setShowCheckoutSuccess(true);
  };

  // Custom reviews submission callback
  const handleAddReview = (productId, reviewObj) => {
    setProductsList((prevProducts) => 
      prevProducts.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [reviewObj, ...p.reviews];
          const averageRating = parseFloat(
            (updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: averageRating
          };
        }
        return p;
      })
    );

    // Also update selected product review display live
    setSelectedProduct((prevSelected) => {
      if (prevSelected && prevSelected.id === productId) {
        const updatedReviews = [reviewObj, ...prevSelected.reviews];
        const averageRating = parseFloat(
          (updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1)
        );
        return {
          ...prevSelected,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: averageRating
        };
      }
      return prevSelected;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setMaxPrice(55000);
    setMinRating(0);
    setSortBy('featured');
    setVisibleCount(PAGINATION_STEP);
  };

  // --- Filtering & Sorting Compute ---

  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // Search query search (titles, category, descriptions, specs)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.features.some(f => f.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== '') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Price Filter
    result = result.filter(p => p.price <= maxPrice);

    // Rating Filter
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // Sorting Logic
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [productsList, searchQuery, selectedCategory, maxPrice, minRating, sortBy]);

  // Slice product list for pagination
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMoreProducts = filteredProducts.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGINATION_STEP);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Header Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setVisibleCount(PAGINATION_STEP); }}
        isDarkMode={isDarkMode}
        toggleDarkMode={handleToggleDarkMode}
        cartItemsCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* Hero Banner Grid (Amazon/Flipkart Carousel style highlight) */}
      <div style={{ 
        background: 'linear-gradient(135deg, hsl(250, 80%, 65%), hsl(330, 80%, 60%))',
        color: 'white',
        padding: '48px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            padding: '6px 16px', 
            borderRadius: '999px', 
            fontSize: '13px', 
            fontWeight: '800', 
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Welcome to Abishith Store
          </span>
          <h1 style={{ color: 'white', fontSize: '42px', fontWeight: '800', margin: '16px 0 8px 0', fontFamily: 'var(--font-heading)' }}>
            Original Products. Unbeatable Quality.
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            Browse and search across our premium catalog of 150+ electronic gizmos, sleek wearables, fitness apparatus, clothing, and home accessories.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }}>
              <CheckCircle size={16} /> 100% Non-Duplicate Verified Photos
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }}>
              <CheckCircle size={16} /> Verified Product Reviews
            </span>
          </div>
        </div>
        {/* Abstract design elements */}
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', top: '-100px', left: '-50px' }}></div>
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', bottom: '-200px', right: '-100px' }}></div>
      </div>

      {/* 2. Main E-commerce Layout */}
      <main className="app-layout">
        
        {/* Left Sidebar Filter Section */}
        <aside className="sidebar-filters">
          <div className="filter-card">
            
            <div className="filter-title">
              <span>Filter Catalog</span>
              <button 
                type="button" 
                className="filter-clear-btn"
                onClick={handleResetFilters}
              >
                Reset All
              </button>
            </div>

            {/* Filter by Category */}
            <div className="filter-group">
              <h4 className="filter-group-title">Product Category</h4>
              <div className="category-list">
                <button
                  type="button"
                  className={`category-item ${selectedCategory === '' ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(''); setVisibleCount(PAGINATION_STEP); }}
                >
                  All Categories (160)
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-item ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => { setSelectedCategory(cat); setVisibleCount(PAGINATION_STEP); }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Max Price */}
            <div className="filter-group">
              <h4 className="filter-group-title">Maximum Price</h4>
              <div className="price-slider-container">
                <input
                  type="range"
                  min="200"
                  max="55000"
                  step="200"
                  className="price-slider"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(parseInt(e.target.value)); setVisibleCount(PAGINATION_STEP); }}
                />
                <div className="price-labels">
                  <span>Min: ₹200</span>
                  <span>Up to: <span>₹{maxPrice.toLocaleString('en-IN')}</span></span>
                </div>
              </div>
            </div>

            {/* Filter by Minimum Rating */}
            <div className="filter-group">
              <h4 className="filter-group-title">Minimum Customer Rating</h4>
              <div className="rating-selector">
                <button
                  type="button"
                  className={`rating-option ${minRating === 0 ? 'active' : ''}`}
                  onClick={() => { setMinRating(0); setVisibleCount(PAGINATION_STEP); }}
                >
                  Any Rating
                </button>
                {[4, 4.3, 4.6].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    className={`rating-option ${minRating === rate ? 'active' : ''}`}
                    onClick={() => { setMinRating(rate); setVisibleCount(PAGINATION_STEP); }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--rating-color)' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < Math.floor(rate) ? "currentColor" : "none"} 
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px' }}>{rate}★ & Up</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Right Product Grid Section */}
        <section className="catalog-view">
          
          {/* Catalog Top bar control */}
          <div className="catalog-header">
            <div className="catalog-info">
              Showing <span>{Math.min(filteredProducts.length, visibleCount)}</span> of <span>{filteredProducts.length}</span> Products
            </div>
            
            <div className="catalog-sort">
              <span>Sort By:</span>
              <select 
                className="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured Ratings</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="no-results animate-scale">
              <AlertTriangle className="no-results-icon" size={48} />
              <h3 className="no-results-title">No Matching Products Found</h3>
              <p className="no-results-desc">
                We couldn't find anything matching your filters. Try resetting the criteria or modifying your search term.
              </p>
              <button 
                type="button" 
                className="btn-checkout" 
                style={{ width: 'auto', padding: '12px 24px' }}
                onClick={handleResetFilters}
              >
                <RotateCcw size={16} />
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          {/* Load More Button / Pagination */}
          {hasMoreProducts && (
            <div className="pagination-container">
              <button 
                type="button" 
                className="btn-load-more"
                onClick={handleLoadMore}
              >
                Load More Products
              </button>
            </div>
          )}

        </section>
      </main>

      {/* 3. Footer */}
      <Footer onOpenSupport={() => setIsSupportOpen(true)} />

      {/* --- Overlay Components --- */}

      {/* Cart Drawer Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckoutSuccess}
      />

      {/* Product Detail Popup Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onAddReview={handleAddReview}
        />
      )}

      {/* Checkout Success Popup */}
      {showCheckoutSuccess && (
        <div className="checkout-success-backdrop" onClick={() => setShowCheckoutSuccess(false)}>
          <div className="checkout-success-card" onClick={(e) => e.stopPropagation()}>
            <div className="success-badge">
              <CheckCircle size={40} />
            </div>
            <h3 className="success-title">Order Placed Successfully!</h3>
            <p className="success-message">
              Thank you for purchasing from **Abishith Store**. Your order details have been sent to your registered contact.
              Our support helpline is active at **9751618359** and email support at **Abishith@gmail.com** for query resolution.
            </p>
            <button 
              type="button" 
              className="btn-success-close"
              onClick={() => setShowCheckoutSuccess(false)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Floating Support/Helpline Action Button */}
      <button 
        type="button" 
        className="floating-support-btn animate-scale"
        onClick={() => setIsSupportOpen(true)}
        title="Open Support Helpline Desk"
        aria-label="Contact helpline support"
      >
        <span className="floating-support-badge">24/7 Support</span>
        <Phone size={20} className="phone-icon" />
        <span className="floating-support-text">Helpline Desk</span>
      </button>

      {/* Support Helpline Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

    </div>
  );
}
