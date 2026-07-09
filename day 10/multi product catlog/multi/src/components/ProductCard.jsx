import { Check, ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product, onViewDetails, onAddToCart }) {
  const { name, category, image, price, originalPrice, discount, rating, reviewsCount, features } = product;

  return (
    <article className="product-card">
      {/* Discount Badge */}
      {discount > 0 && (
        <span className="product-badge">
          {discount}% OFF
        </span>
      )}

      {/* Product Image Wrapper */}
      <div className="product-card-image-wrapper">
        <img 
          src={image} 
          alt={name} 
          className="product-card-image"
          loading="lazy"
        />
      </div>

      {/* Product Body */}
      <div className="product-card-body">
        <span className="product-card-category">{category}</span>
        <h3 className="product-card-title" title={name}>{name}</h3>

        {/* Rating and Reviews */}
        <div className="product-card-rating">
          <span className="rating-badge">
            {rating} ★
          </span>
          <span className="product-card-reviews">({reviewsCount} Reviews)</span>
        </div>

        {/* Key Features Preview (First 2 specs) */}
        <ul className="product-card-features">
          {features.slice(0, 2).map((feature, idx) => (
            <li key={idx}>
              <Check size={12} className="product-card-features-icon" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Price Row */}
        <div className="product-card-price-row">
          <span className="price-current">₹{price.toLocaleString('en-IN')}</span>
          <span className="price-original">₹{originalPrice.toLocaleString('en-IN')}</span>
          <span className="price-discount">{discount}% off</span>
        </div>

        {/* Action Buttons */}
        <div className="product-card-actions">
          <button 
            type="button" 
            className="btn-card btn-card-details"
            onClick={() => onViewDetails(product)}
          >
            <Eye size={14} />
            Details
          </button>
          <button 
            type="button" 
            className="btn-card btn-card-add"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
