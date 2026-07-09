import { useState } from 'react';
import { X, Star, Check, ShoppingCart } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart, onAddReview }) {
  // All hooks must be before any conditional returns (Rules of Hooks)
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [showFormFeedback, setShowFormFeedback] = useState(false);

  if (!product) return null;

  const { id, name, category, image, price, originalPrice, discount, rating, reviewsCount, description, features, reviews } = product;



  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newComment.trim()) return;

    const newReview = {
      reviewer: newReviewerName,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0]
    };

    onAddReview(id, newReview);

    // Reset form
    setNewReviewerName('');
    setNewRating(5);
    setNewComment('');
    setShowFormFeedback(true);
    setTimeout(() => {
      setShowFormFeedback(false);
    }, 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Grid */}
        <div className="modal-grid">
          {/* Gallery / Image column */}
          <div className="modal-gallery">
            <div className="modal-image-wrapper">
              <img src={image} alt={name} className="modal-image" />
            </div>
          </div>

          {/* Details Column */}
          <div className="modal-info">
            <span className="modal-category">{category}</span>
            <h2 className="modal-title">{name}</h2>

            {/* Ratings & Counts */}
            <div className="modal-rating-row">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.round(rating) ? "currentColor" : "none"} 
                    className="star-icon"
                  />
                ))}
              </div>
              <span className="rating-badge">{rating} / 5</span>
              <span className="product-card-reviews">({reviewsCount} customer ratings)</span>
            </div>

            {/* Price Box */}
            <div className="modal-price-row">
              <div>
                <span className="modal-price-current">₹{price.toLocaleString('en-IN')}</span>
                <span className="price-original" style={{ marginLeft: '12px' }}>₹{originalPrice.toLocaleString('en-IN')}</span>
              </div>
              <span className="price-discount" style={{ fontWeight: '800', marginLeft: 'auto' }}>
                {discount}% OFF (Save ₹{(originalPrice - price).toLocaleString('en-IN')})
              </span>
            </div>

            {/* Description */}
            <p className="modal-description">{description}</p>

            {/* Specifications Section */}
            <h3 className="modal-section-title">Product Highlights</h3>
            <ul className="modal-features-list">
              {features.map((feature, idx) => (
                <li key={idx}>
                  <Check size={14} className="modal-features-list-icon" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Action buttons */}
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-modal-action btn-modal-cart"
                onClick={() => {
                  onAddToCart(product);
                }}
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button 
                type="button" 
                className="btn-modal-action btn-modal-buy"
                onClick={() => {
                  onAddToCart(product);
                  // Trigger cart open instead of checkout directly
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="reviews-section">
          <h3 className="modal-section-title">Verified Customer Reviews</h3>

          {/* List of existing reviews */}
          <div className="reviews-list-container">
            {reviews.length === 0 ? (
              <p className="product-card-reviews">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map((rev, idx) => (
                <div className="review-item animate-fade" key={idx}>
                  <div className="review-header">
                    <span className="review-author">{rev.reviewer}</span>
                    <span className="review-date">{rev.date}</span>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        fill={i < rev.rating ? "currentColor" : "none"} 
                      />
                    ))}
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add a review form */}
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h4 className="review-form-title">Write a Product Review</h4>
            
            {/* Rating Stars Select */}
            <div className="review-form-stars">
              {[...Array(5)].map((_, i) => {
                const starVal = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`btn-star-select ${starVal <= (hoverRating || newRating) ? 'active' : ''}`}
                    onClick={() => setNewRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star size={20} fill={starVal <= (hoverRating || newRating) ? "currentColor" : "none"} />
                  </button>
                );
              })}
            </div>

            {/* Review Inputs */}
            <div className="review-form-grid">
              <input 
                type="text" 
                className="review-input" 
                placeholder="Your Name" 
                value={newReviewerName}
                onChange={(e) => setNewReviewerName(e.target.value)}
                required
              />
              <textarea 
                className="review-input review-textarea" 
                placeholder="Write your detailed review about product quality, utility and design..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <button type="submit" className="btn-submit-review">
                Submit Review
              </button>
              
              {showFormFeedback && (
                <span className="animate-scale" style={{ color: 'var(--success)', fontSize: '13px', fontWeight: '700' }}>
                  ✓ Review submitted successfully!
                </span>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
