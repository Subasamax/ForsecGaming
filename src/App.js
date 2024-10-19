import React from "react";
import MenuBar from "./components/menuBar";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./css/App.css";
import Home from "./components/home";
import Games from "./components/games";
import GamesList from "./components/gameCardList";
import PublishGame from "./components/publishGame";

function App() {
  const [data, setData] = React.useState(null);

  // home
  // publish
  // games list
  // game page
  // play game is the old games
  return (
    <Router>
      <div className="App">
        <MenuBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publish" element={<PublishGame />} />
          <Route path="/games" element={<GamesList />} />
          <Route path="/games/:gameID" element={<Games />} />
          <Route path="/games/:gameID/play" element={<Games />} />
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
