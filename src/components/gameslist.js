import React, { useEffect, useState } from "react";
import { GameListRow } from "./gamesListRow";

export const Gameshelf = () => {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [pubDate, setPubDate] = useState("");
  const [rating, setRating] = useState("");
  const [Games, setGames] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // renders once
    fetchGames();
  }, []); // since empty list

  const fetchGames = async () => {
    try {
      const response = await fetch("http://localhost:3001/games/all");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setGames(data);
      setLoading(false);
    } catch (error) {
      console.error(`There was an error retrieving the Game list: ${error}`);
    }
  };

  const handleInputsReset = () => {
    setAuthor("");
    setTitle("");
    setPubDate("");
    setRating("");
    setImage("");
  };

  const handleGameCreate = async () => {
    try {
      const response = await fetch("http://localhost:3001/games/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: author,
          title: title,
          pubDate: pubDate,
          rating: rating,
          image: image,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      fetchGames();
    } catch (error) {
      console.error(`There was an error creating the ${title} Game: ${error}`);
    }
  };

  const handleGameSubmit = () => {
    if (
      author.length > 0 &&
      title.length > 0 &&
      pubDate.length > 0 &&
      rating.length > 0 &&
      image.length > 0 // tempoary measure as image is just a string right now
    ) {
      handleGameCreate(); // create game
      console.info(`Game ${title} by ${author} added.`); // add to console
      handleInputsReset(); // reset input to empty
    }
  };

  const handleGameRemove = async (id, title) => {
    try {
      const response = await fetch("http://localhost:3001/games/delete", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(`Game ${title} removed.`);
      fetchGames();
    } catch (error) {
      console.error(`There was an error removing the ${title} Game: ${error}`);
    }
  };

  const handleListReset = async () => {
    try {
      const response = await fetch("http://localhost:3001/games/reset", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      fetchGames(); // refresh game list
    } catch (error) {
      console.error(`There was an error resetting the Game list: ${error}`);
    }
  };

  return (
    <div className="Game-list-wrapper">
      <div className="Game-list-form">
        <div className="form-wrapper" onSubmit={handleGameSubmit}>
          <div className="form-row">
            <fieldset>
              <label className="form-label" htmlFor="title">
                Enter title:
              </label>
              <input
                className="form-input"
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
              />
            </fieldset>
            <fieldset>
              <label className="form-label" htmlFor="author">
                Enter author:
              </label>
              <input
                className="form-input"
                type="text"
                id="author"
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.currentTarget.value)}
              />
            </fieldset>
          </div>
          <div className="form-row">
            <fieldset>
              <label className="form-label" htmlFor="pubDate">
                Enter publication date:
              </label>
              <input
                className="form-input"
                type="text"
                id="pubDate"
                name="pubDate"
                value={pubDate}
                onChange={(e) => setPubDate(e.currentTarget.value)}
              />
            </fieldset>
            <fieldset>
              <label className="form-label" htmlFor="rating">
                Enter rating:
              </label>
              <input
                className="form-input"
                type="text"
                id="rating"
                name="rating"
                value={rating}
                onChange={(e) => setRating(e.currentTarget.value)}
              />
            </fieldset>
            <fieldset>
              <label className="form-label" htmlFor="image">
                Enter image:
              </label>
              <input
                className="form-input"
                type="text"
                id="image"
                name="image"
                value={image}
                onChange={(e) => setImage(e.currentTarget.value)}
              />
            </fieldset>
          </div>
        </div>
        <button onClick={handleGameSubmit} className="btn btn-success">
          Add the Game
        </button>
      </div>

      {/* Render Gameshelf list component */}
      <table>
        <tbody>
          {Games.map((Game, index) => (
            <GameListRow
              key={Game.id} // or another unique identifier
              position={index + 1}
              Game={Game}
              handleGameRemove={handleGameRemove}
            />
          ))}
        </tbody>
      </table>

      {Games.length > 0 && (
        <button className="btn btn-danger" onClick={handleListReset}>
          Reset Games list.
        </button>
      )}
    </div>
  );
};
