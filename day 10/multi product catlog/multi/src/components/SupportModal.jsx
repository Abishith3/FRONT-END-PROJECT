import { useState, useEffect, useRef } from 'react';
import { X, Phone, Mail, MessageSquare, Ticket, FileText, Send, CheckCircle } from 'lucide-react';

export default function SupportModal({ isOpen, onClose }) {
  // ALL hooks must come before any early return (Rules of Hooks)
  const [activeTab, setActiveTab] = useState('chat'); // chat, ticket, faq
  
  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! Welcome to Abishith Premium Support Desk. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Ticket Form state
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('abishith@gmail.com');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Guard: render nothing if modal is closed
  if (!isOpen) return null;

  // Handle chatbot simulated response
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const query = chatInput.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    // Simulate response delay
    setTimeout(() => {
      let botReply = '';
      if (query.includes('cancel') || query.includes('cancellation')) {
        botReply = "You can cancel any order directly from your dashboard before it gets dispatched. If it's already shipped, simply reject the package or request a free replacement within 10 days of delivery.";
      } else if (query.includes('return') || query.includes('replace') || query.includes('replacement') || query.includes('refund')) {
        botReply = "Abishith Store offers a hassle-free 10-day replacement policy on all items. You can initiate this online, and our courier will execute a reverse pickup. For refunds, the amount is credited to your source payment within 5 business days.";
      } else if (query.includes('shipping') || query.includes('delivery') || query.includes('track') || query.includes('where is my order')) {
        botReply = "Standard dispatch takes 24 hours. Delivery is completely FREE on orders above ₹999; otherwise, a nominal flat fee of ₹40 applies. You'll receive real-time SMS updates with the AWB tracking link.";
      } else if (query.includes('contact') || query.includes('helpline') || query.includes('number') || query.includes('phone') || query.includes('mail') || query.includes('email') || query.includes('call')) {
        botReply = "Our official voice helpline is **9751618359** (9 AM to 9 PM, Mon-Sat) and support email desk is **abishith@gmail.com** (available 24/7).";
      } else if (query.includes('abishith')) {
        botReply = "Abishith is our founder and principal customer advocate. All escalations are directly reviewed under his personal queue to guarantee pristine service.";
      } else if (query.includes('offer') || query.includes('discount') || query.includes('coupon')) {
        botReply = "We offer standard discounts up to 40% off across our catalog. Use coupon code 'ABISHITHFIRST' on your first order to get an extra 10% off!";
      } else {
        botReply = "Thanks for the query. Our helpline support is accessible at **9751618359** and email support at **abishith@gmail.com**. Please write to us or raise a support ticket in the next tab for specialized investigation!";
      }

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  // Handle support ticket submission
  const handleRaiseTicket = (e) => {
    e.preventDefault();
    if (!ticketName || !ticketSubject || !ticketDescription) return;

    // Generate random Ticket ID
    const randomId = 'TK-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(randomId);
    setTicketSuccess(true);

    // Reset Form
    setTicketName('');
    setTicketSubject('');
    setTicketDescription('');
  };

  const handleResetTicketForm = () => {
    setTicketSuccess(false);
    setTicketId('');
  };

  const faqData = [
    {
      q: "What is Abishith's replacement policy?",
      a: "We offer a 10-day replacement policy for all products in case of technical issues, damage on delivery, or size mismatches. Items must be returned with original packaging and invoices."
    },
    {
      q: "Are the listed product photos original?",
      a: "Yes! Every single photo across our catalog of 150+ products represents a unique, non-duplicate high-definition visual depiction of the item you receive. We strictly avoid duplicate placeholders."
    },
    {
      q: "How can I contact customer support directly?",
      a: "You can reach us directly via our voice helpline at 9751618359 or by email at abishith@gmail.com. We endeavor to resolve all inquiries within 24 hours."
    },
    {
      q: "How long does delivery take?",
      a: "Metro orders are delivered within 2 days, and other areas within 3 to 5 business days. Delivery is free for all orders above ₹999."
    },
    {
      q: "Can I pay Cash on Delivery (COD)?",
      a: "Yes! Cash on Delivery is supported at no extra cost for all pin codes across India."
    }
  ];

  return (
    <div className="support-backdrop" onClick={onClose}>
      <div className="support-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="support-header">
          <div>
            <h2 className="support-title">Abishith Help & Helpline Center</h2>
            <p className="support-subtitle">Resolve issues, check FAQs, or chat with our live helpdesk</p>
          </div>
          <button type="button" className="support-close-btn" onClick={onClose} aria-label="Close support center">
            <X size={20} />
          </button>
        </div>

        {/* Support Grid layout */}
        <div className="support-body-grid">
          
          {/* Left panel - Quick Contacts */}
          <aside className="support-contacts-panel">
            <h3 className="contact-panel-title">Direct Helpline Desk</h3>
            
            <div className="contact-card">
              <div className="contact-icon-wrapper">
                <Phone size={20} />
              </div>
              <div className="contact-details">
                <span className="contact-label">Call Support</span>
                <a href="tel:9751618359" className="contact-value">9751618359</a>
                <span className="contact-availability">9:00 AM - 9:00 PM IST</span>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon-wrapper">
                <Mail size={20} />
              </div>
              <div className="contact-details">
                <span className="contact-label">Support Email</span>
                <a href="mailto:abishith@gmail.com" className="contact-value">abishith@gmail.com</a>
                <span className="contact-availability">24/7 Support Desk</span>
              </div>
            </div>

            <div className="support-manager-card">
              <span className="manager-title">Customer Care Lead</span>
              <span className="manager-name">Abishith</span>
              <p className="manager-note">
                Our support desk operates under direct supervision of Abishith to maintain pristine Flipkart & Amazon level quality standards.
              </p>
            </div>
          </aside>

          {/* Right panel - Tabbed Interactive Section */}
          <main className="support-interactive-panel">
            {/* Tabs Selector */}
            <div className="support-tabs">
              <button 
                type="button"
                className={`support-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                <MessageSquare size={16} />
                Live Chat Support
              </button>
              <button 
                type="button"
                className={`support-tab-btn ${activeTab === 'ticket' ? 'active' : ''}`}
                onClick={() => setActiveTab('ticket')}
              >
                <Ticket size={16} />
                Raise Support Ticket
              </button>
              <button 
                type="button"
                className={`support-tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
                onClick={() => setActiveTab('faq')}
              >
                <FileText size={16} />
                Browse FAQs
              </button>
            </div>

            {/* Tab Body */}
            <div className="support-tab-body">
              
              {/* TAB 1: Chatbot */}
              {activeTab === 'chat' && (
                <div className="chat-container">
                  <div className="chat-messages-box">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user' : 'bot'}`}
                      >
                        <div className="chat-bubble">
                          <p>{msg.text}</p>
                          <span className="chat-time">{msg.time}</span>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="chat-bubble-wrapper bot">
                        <div className="chat-bubble typing">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form className="chat-input-row" onSubmit={handleSendMessage}>
                    <input 
                      type="text" 
                      className="chat-input-field"
                      placeholder="Ask about cancellation, returns, delivery, contact info..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button type="submit" className="chat-send-btn" disabled={!chatInput.trim()}>
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: Raise Ticket Form */}
              {activeTab === 'ticket' && (
                <div className="ticket-container">
                  {ticketSuccess ? (
                    <div className="ticket-success-view animate-scale">
                      <CheckCircle size={48} className="ticket-success-icon" />
                      <h3 className="ticket-success-title">Support Ticket Raised Successfully!</h3>
                      <p className="ticket-success-desc">
                        Your Ticket ID is <strong>{ticketId}</strong>. We have dispatched a confirmation email to <strong>{ticketEmail}</strong>. 
                        Abishith's customer support desk will analyze the issue and resolve it within 2 hours.
                      </p>
                      <button 
                        type="button" 
                        className="btn-checkout" 
                        style={{ width: 'auto', padding: '10px 20px', marginTop: '16px' }}
                        onClick={handleResetTicketForm}
                      >
                        Raise Another Ticket
                      </button>
                    </div>
                  ) : (
                    <form className="ticket-form" onSubmit={handleRaiseTicket}>
                      <div className="ticket-form-group">
                        <label className="ticket-label">Your Name</label>
                        <input 
                          type="text" 
                          className="review-input" 
                          placeholder="Enter your name" 
                          value={ticketName}
                          onChange={(e) => setTicketName(e.target.value)}
                          required 
                        />
                      </div>

                      <div className="ticket-form-group">
                        <label className="ticket-label">Email Address (Registered)</label>
                        <input 
                          type="email" 
                          className="review-input" 
                          placeholder="abishith@gmail.com" 
                          value={ticketEmail}
                          onChange={(e) => setTicketEmail(e.target.value)}
                          required 
                        />
                      </div>

                      <div className="ticket-form-group">
                        <label className="ticket-label">Issue Subject</label>
                        <input 
                          type="text" 
                          className="review-input" 
                          placeholder="e.g. Delay in shipment / Faulty product replacement" 
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          required 
                        />
                      </div>

                      <div className="ticket-form-group">
                        <label className="ticket-label">Detailed Description</label>
                        <textarea 
                          className="review-input review-textarea" 
                          style={{ minHeight: '100px' }}
                          placeholder="Please provide order id, exact issue details and preferences..." 
                          value={ticketDescription}
                          onChange={(e) => setTicketDescription(e.target.value)}
                          required
                        />
                      </div>

                      <button type="submit" className="btn-submit-review" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Ticket size={16} />
                        Submit Help Ticket
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: FAQs */}
              {activeTab === 'faq' && (
                <div className="faq-container">
                  <div className="faq-list">
                    {faqData.map((faq, idx) => (
                      <div key={idx} className="faq-item">
                        <h4 className="faq-question">{faq.q}</h4>
                        <p className="faq-answer">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
