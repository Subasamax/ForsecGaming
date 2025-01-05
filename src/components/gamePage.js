import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LeaveReview from "./leaveReview.jsx"; // Import your GameCard component
import Reviews from "./reviews.js";
import "./../css/gamePage.css";

const GamePage = () => {
  const [games, setGames] = useState([]); // State to hold the games data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [rating, setRating] = useState(0);
  const { gameID } = useParams();
  const imageURL = `http://localhost:3001/${gameID}/static/photo`;
  const gameLink = `http://localhost:3000/games/${gameID}/play`;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`http://localhost:3001/games/${gameID}`); // Adjust the URL as needed

        const data = await response.json();
        if (!response.ok) {
          throw new Error(`Network response was not ok, ${data.message}`);
        }
        setGames(data);
      } catch (error) {
        setError(error.message); // Set error message in state
      } finally {
        setLoading(false); // Set loading to false
      }
    };
    fetchGames(); // Call the fetch function
  }, [gameID]); // Empty dependency array to run once when the component mounts

  useEffect(() => {
    if (games.length > 0 && games[0].rating !== "[object Object]") {
      const ratingList = JSON.parse(games[0].rating);
      setRating(
        (
          ratingList.reduce((accum, review) => {
            return accum + Number(review.rating); // Add review rating to accumulator
          }, 0) / ratingList.length
        ).toFixed(1)
      ); // Initial value of accumulator is 0
    } //Calculates Rating value
  }, [games]);

  function handleButtonPress() {
    window.location.href = gameLink;
  }

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return (
    <div className="gamePage">
      <div className="gameContainer">
        <img src={imageURL} alt="Game" className="gameImage"></img>
        <div className="gameInfo">
          <div className="titleRating">
            <h1 className="gameHeader">{games[0].title}</h1>
            <div className="gamePageRating"> Rating: {rating}</div>
          </div>
          <button className="playButton" onClick={handleButtonPress}>
            Play Game
          </button>
        </div>
      </div>
      <hr className="whiteDivider"></hr>
      <div className="descriptionHeader">Game Description</div>
      <div className="description">{games[0].description}</div>
      <hr className="whiteDivider"></hr>
      <LeaveReview gameID={gameID} />
      <hr className="whiteDivider"></hr>
      <div className="descriptionHeader">Reviews</div>
      <hr className="whiteDivider"></hr>
      <div className="reviewsGrid">
        {/* Use a div for the grid layout */}
        {games[0].rating !== "[object Object]" &&
          JSON.parse(games[0].rating).map((review, i) => (
            <Reviews
              key={i}
              userName={review.userName}
              date={review.date}
              description={review.description}
              rating={review.rating}
            />
          ))}
      </div>
    </div>
  );
};

export default GamePage;
