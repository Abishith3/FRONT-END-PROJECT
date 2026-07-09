import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}) {
  if (!isOpen) return null;

  // Invoice calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalOriginalPrice = cartItems.reduce((acc, item) => acc + (item.originalPrice * item.quantity), 0);
  const totalCurrentPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalSavings = totalOriginalPrice - totalCurrentPrice;

  // Delivery charge
  const deliveryCharge = totalCurrentPrice > 999 ? 0 : 40;

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">
            <ShoppingBag size={22} className="color-primary" />
            Shopping Cart ({totalItemsCount})
          </h2>
          <button type="button" className="cart-drawer-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body - Scrollable Items */}
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="cart-empty animate-scale">
              <ShoppingBag size={64} className="cart-empty-icon" />
              <h3 className="cart-empty-title">Your Cart is Empty</h3>
              <p style={{ fontSize: '13.5px', maxWidth: '240px', margin: '0 auto' }}>
                Fill it with Abishith premium devices, fashion, and lifestyle items.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item animate-fade" key={item.id}>
                {/* Product Thumbnail */}
                <div className="cart-item-image-wrapper">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                </div>

                {/* Details */}
                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.name}</h4>
                  
                  {/* Pricing */}
                  <div className="cart-item-price-row">
                    <span className="cart-item-price-current">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    <span className="cart-item-price-original">₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}</span>
                  </div>

                  {/* Quantity and Actions Row */}
                  <div className="cart-item-controls">
                    {/* Quantity Controller */}
                    <div className="quantity-controller">
                      <button 
                        type="button" 
                        className="btn-quantity"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button 
                        type="button" 
                        className="btn-quantity"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Remove Item */}
                    <button 
                      type="button" 
                      className="btn-remove-item"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer - Price details and checkout */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="invoice-card">
              <h3 className="invoice-title">Price Details</h3>
              
              <div className="invoice-row">
                <span>Price ({totalItemsCount} items)</span>
                <span>₹{totalOriginalPrice.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="invoice-row savings">
                <span>Discount</span>
                <span>- ₹{totalSavings.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="invoice-row">
                <span>Delivery Charges</span>
                <span>{deliveryCharge === 0 ? "FREE Delivery" : `₹${deliveryCharge}`}</span>
              </div>

              <div className="invoice-total-row">
                <span>Total Amount</span>
                <span>₹{(totalCurrentPrice + deliveryCharge).toLocaleString('en-IN')}</span>
              </div>

              {totalSavings > 0 && (
                <div style={{ color: 'var(--success)', fontSize: '13px', fontWeight: '700', marginTop: '4px', textAlign: 'center' }}>
                  You will save ₹{totalSavings.toLocaleString('en-IN')} on this order!
                </div>
              )}
            </div>

            <button 
              type="button" 
              className="btn-checkout"
              onClick={onCheckout}
            >
              Place Order
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
