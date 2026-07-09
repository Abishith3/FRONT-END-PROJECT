import { Phone, Mail, MapPin, Shield, RefreshCw, Truck, Heart } from 'lucide-react';

export default function Footer({ onOpenSupport }) {
  return (
    <footer className="footer-container">
      {/* Policy Highlights / Features Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        maxWidth: '1400px',
        margin: '0 auto 40px auto',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Truck size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-heading)' }}>Free Shipping</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>On orders above ₹999</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <RefreshCw size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-heading)' }}>10 Days Replacement</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Easy returns and replacements</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Shield size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-heading)' }}>100% Original Products</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sourced directly from Abishith</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info Grid */}
      <div className="footer">
        {/* Brand details */}
        <div className="footer-brand-column">
          <h3 className="nav-brand" style={{ display: 'inline-block', margin: '0' }}>Abishith</h3>
          <p className="footer-brand-desc">
            Abishith is India's next-generation e-commerce catalog platform. Delivering original premium products, unmatched technology, stylish fashion, and fitness gear straight to your doorstep.
          </p>
        </div>

        {/* About column */}
        <div>
          <h4 className="footer-title">About Us</h4>
          <ul className="footer-links">
            <li><a href="#about" onClick={(e) => e.preventDefault()}>Company Profile</a></li>
            <li><a href="#careers" onClick={(e) => e.preventDefault()}>Careers at Abishith</a></li>
            <li><a href="#press" onClick={(e) => e.preventDefault()}>Press Releases</a></li>
            <li><a href="#blog" onClick={(e) => e.preventDefault()}>Abishith Blog</a></li>
          </ul>
        </div>

        {/* Policy column */}
        <div>
          <h4 className="footer-title">Policy & Help</h4>
          <ul className="footer-links">
            <li><a href="#return" onClick={(e) => { e.preventDefault(); onOpenSupport(); }}>Return & Replacement Policy</a></li>
            <li><a href="#terms" onClick={(e) => { e.preventDefault(); onOpenSupport(); }}>Terms of Use</a></li>
            <li><a href="#privacy" onClick={(e) => { e.preventDefault(); onOpenSupport(); }}>Privacy Policy</a></li>
            <li><a href="#security" onClick={(e) => { e.preventDefault(); onOpenSupport(); }}>Helpline Center Desk</a></li>
          </ul>
        </div>

        {/* Helpline and Contacts column */}
        <div>
          <h4 className="footer-title">Helpline Contacts</h4>
          <div className="footer-contact-item highlight" onClick={onOpenSupport} style={{ cursor: 'pointer' }} title="Click to open Support Desk">
            <Phone size={16} className="footer-contact-icon" />
            <div>
              <strong>Call Support Helpline:</strong>
              <div style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px' }}>9751618359</div>
            </div>
          </div>
          
          <div className="footer-contact-item highlight" onClick={onOpenSupport} style={{ cursor: 'pointer' }} title="Click to open Support Desk">
            <Mail size={16} className="footer-contact-icon" />
            <div>
              <strong>Support Email Desk:</strong>
              <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '2px' }}>abishith@gmail.com</div>
            </div>
          </div>

          <div className="footer-contact-item">
            <MapPin size={16} className="footer-contact-icon" />
            <div>
              <span>Abishith Headquarters, Corporate Tech Park, Bengaluru, Karnataka, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer Bottom */}
      <div className="footer-bottom">
        <div>
          © {new Date().getFullYear()} Abishith Retail India Private Limited. All Rights Reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>Crafted with</span>
          <Heart size={12} style={{ color: 'var(--danger)', fill: 'var(--danger)' }} />
          <span>for premium coding standards.</span>
        </div>
      </div>
    </footer>
  );
}
