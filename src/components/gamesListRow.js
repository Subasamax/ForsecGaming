// Import dependencies
import React from "react";
import PropTypes from "prop-types";

import "./../css/gamesList.css";
// Create GameshelfListRow component
const GameListRow = (props) => {
  const { position, Game, handleGameRemove } = props;

  // Handle cases where Game might be undefined
  if (!Game) {
    return (
      <tr className="table-row">
        <td className="table-item" colSpan="6">
          Game data is not available
        </td>
      </tr>
    );
  }

  // Render the table row with Game details
  return (
    <tr className="table-row">
      <td className="table-item">{position}</td>

      <td className="table-item">{Game.title || "No Title"}</td>

      <td className="table-item">{Game.author || "No Author"}</td>

      <td className="table-item">{Game.pubDate || "No Publication Date"}</td>

      <td className="table-item">{Game.rating || "No Rating"}</td>

      <td className="table-item">{Game.image || "No image"}</td>

      <td className="table-item">
        <button
          className="btn btn-danger"
          onClick={() => handleGameRemove(Game.id, Game.title)}
        >
          Remove Game
        </button>
      </td>
    </tr>
  );
};

// Define PropTypes for type checking
GameListRow.propTypes = {
  position: PropTypes.number.isRequired,
  Game: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    author: PropTypes.string,
    pubDate: PropTypes.string,
    rating: PropTypes.string,
    image: PropTypes.any, // image
  }),
  handleGameRemove: PropTypes.func.isRequired,
};

export { GameListRow };
