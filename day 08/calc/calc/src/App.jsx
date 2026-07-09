import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    setInput(input + value);
  };

  const clearDisplay = () => {
    setInput("");
  };

  const deleteLast = () => {
    setInput(input.slice(0, -1));
  };

  const calculate = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput("Error");
    }
  };

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+"
  ];

  return (
    <div className="container">
      <div className="calculator">

        <h1>Calculator</h1>

        <input
          type="text"
          value={input}
          readOnly
          className="display"
        />

        <div className="top-buttons">
          <button className="clear" onClick={clearDisplay}>
            AC
          </button>

          <button className="delete" onClick={deleteLast}>
            DEL
          </button>
        </div>

        <div className="buttons">
          {buttons.map((btn, index) => (
            <button
              key={index}
              className={btn === "=" ? "equal" : ""}
              onClick={() =>
                btn === "=" ? calculate() : handleClick(btn)
              }
            >
              {btn}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;