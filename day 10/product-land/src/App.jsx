import "./App.css";
import { useState } from "react";

function App() {
  const products = [
    {
      id: 1,
      name: "iPhone 16 Pro Max",
      category: "Mobile",
      price: 149999,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    },
    {
      id: 2,
      name: "Samsung Galaxy S25 Ultra",
      category: "Mobile",
      price: 129999,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500",
    },
    {
      id: 3,
      name: "OnePlus 13",
      category: "Mobile",
      price: 69999,
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500",
    },
    {
      id: 4,
      name: "MacBook Pro M4",
      category: "Laptop",
      price: 199999,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=500",
    },
    {
      id: 5,
      name: "Dell XPS 15",
      category: "Laptop",
      price: 154999,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
    },
    {
      id: 6,
      name: "HP Victus Gaming",
      category: "Laptop",
      price: 79999,
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500",
    },
    {
      id: 7,
      name: "Sony WH1000XM5",
      category: "Headphone",
      price: 29999,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    },
    {
      id: 8,
      name: "Apple Watch Ultra",
      category: "Watch",
      price: 89999,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    },
    {
      id: 9,
      name: "LG OLED Smart TV",
      category: "TV",
      price: 139999,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500",
    },
    {
      id: 10,
      name: "Canon EOS Camera",
      category: "Camera",
      price: 94999,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    },
  ];

  const [search, setSearch] = useState("");

  const filtered = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <nav>
        <h1>Abishith</h1>

        <input
          type="text"
          placeholder="Search Products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </nav>

      <h2 className="title">Amazon Style Product Catalog</h2>

      <div className="grid">
        {filtered.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.image} alt={item.name} />

            <h3>{item.name}</h3>

            <p>{item.category}</p>

            <h2>₹{item.price.toLocaleString()}</h2>

            <h4>{"⭐".repeat(item.rating)}</h4>

            <button>Add to Cart</button>

            <button className="buy">Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;