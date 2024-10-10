import React from "react";
import MenuBar from "./components/menuBar";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./css/App.css";
import { Gameshelf } from "./components/gameslist";
import Home from "./components/home";
import Games from "./components/games";

function App() {
  const [data, setData] = React.useState(null);

  return (
    <Router>
      <div className="App">
        <MenuBar />
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/shelf" element={<Gameshelf />} />
            <Route path="*" element={<h2>404 Not Found</h2>} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
