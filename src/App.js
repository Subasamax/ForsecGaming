import React from "react";
import MenuBar from "./components/menuBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./css/App.css";
import Games from "./components/games";
import GamesList from "./components/gameCardList";
import PublishGame from "./components/publishGame";
import GamePage from "./components/gamePage";

function App() {
  // home
  // publish
  // games list
  // game page
  // play is where the game is played
  return (
    <Router>
      <div className="App">
        <MenuBar />
        <Routes>
          <Route path="/" element={<GamesList />} />
          <Route path="/publish" element={<PublishGame />} />
          <Route path="/games" element={<GamesList />} />
          <Route path="/games/:gameID" element={<GamePage />} />
          <Route path="/games/:gameID/play" element={<Games />} />
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
