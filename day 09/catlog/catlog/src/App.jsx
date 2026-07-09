import "./App.css";

function App() {
  const products = [
    {
      id: 1,
      name: "iPhone 16 Pro",
      category: "Mobile",
      price: "₹1,29,999",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    },
    {
      id: 2,
      name: "MacBook Pro",
      category: "Laptop",
      price: "₹1,89,999",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
    },
    {
      id: 3,
      name: "Smart Watch",
      category: "Watch",
      price: "₹19,999",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    },
    {
      id: 4,
      name: "Wireless Headphones",
      category: "Audio",
      price: "₹8,999",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
    {
      id: 5,
      name: "DSLR Camera",
      category: "Camera",
      price: "₹74,999",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    },
    {
      id: 6,
      name: "Bluetooth Speaker",
      category: "Speaker",
      price: "₹6,999",
      image:
        "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500",
    },
  ];

  return (
    <div className="app">
      <header>
        <h1>🛒 Product Catalog</h1>
        <p>Latest Electronic Products</p>
      </header>

      <div className="product-grid">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <img src={product.image} alt={product.name} />

            <div className="card-body">
              <span className="category">{product.category}</span>

              <h2>{product.name}</h2>

              <h3>{product.price}</h3>

              <button>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
