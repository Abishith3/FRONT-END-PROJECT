import { Search, ShoppingCart, Sun, Moon, HelpCircle } from 'lucide-react';

export default function Navbar({ 
  searchQuery, 
  onSearchChange, 
  isDarkMode, 
  toggleDarkMode, 
  cartItemsCount, 
  onOpenCart,
  onOpenSupport
}) {
  return (
    <header className="navbar-container">
      <div className="navbar">
        {/* Brand Logo */}
        <a href="/" className="nav-brand" onClick={(e) => { e.preventDefault(); onSearchChange(''); }}>
          Abishith
        </a>

        {/* Search Bar */}
        <div className="nav-search-container">
          <Search className="nav-search-icon" size={18} />
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search from 150+ Abishith products (e.g. mobile, laptop, apparel)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Support Helpline Quick Info */}
          <button 
            type="button"
            className="nav-helpline-btn"
            onClick={onOpenSupport}
            title="Open Abishith Helpline Support Desk"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'right',
              fontFamily: 'inherit',
              borderRight: '1px solid var(--border)',
              paddingRight: '16px',
            }}
          >
            <span className="nav-helpline-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <HelpCircle size={12} className="color-primary" /> Customer Support
            </span>
            <span className="nav-helpline-value" style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '13px' }}>9751618359</span>
          </button>

          {/* Theme Toggle Button */}
          <button 
            type="button" 
            className="btn-icon-nav"
            onClick={toggleDarkMode}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} className="animate-fade" /> : <Moon size={20} className="animate-fade" />}
          </button>

          {/* Cart Trigger Button */}
          <button 
            type="button" 
            className="btn-icon-nav"
            onClick={onOpenCart}
            title="Open Shopping Cart"
            aria-label="Open cart"
          >
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="cart-badge animate-scale">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
