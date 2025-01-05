import React, { useState, useEffect } from "react";
import GameCard from "./gameCard.jsx"; // Import your GameCard component
import "./../css/gamesList.css";

const GamesList = () => {
  const [games, setGames] = useState([]); // State to hold the games data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:3001/games/all"); // Adjust the URL as needed
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setGames(data);
      } catch (error) {
        setError(error.message); // Set error message in state
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchGames(); // Call the fetch function
  }, []); // Empty dependency array to run once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return (
    <div className="games-list">
      <h1 className="title">Games</h1>
      <hr className="titleDivider"></hr>
      <div className="games-grid">
        {" "}
        {/* Use a div for the grid layout */}
        {games.map((game) => (
          <GameCard
            key={game.id}
            gameID={game.id}
            title={game.title}
            userName={game.author}
            date={game.pubDate}
          />
        ))}
      </div>
    </div>
  );
};

export default GamesList;
