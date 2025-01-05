import React from "react";
import "./../css/gameCard.css";

const GameCard = ({ gameID, title, userName, date }) => {
  const imageURL = `http://localhost:3001/${gameID}/static/photo`;
  const gameLink = `http://localhost:3000/games/${gameID}`;

  // truncates text if over the provided limit
  const truncateText = (text, limit) => {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    } else return text;
  };

  return (
    <li id={gameID}>
      <a
        href={gameLink}
        className="game-Screen-Shot"
        title={`The game: ${title}`}
        style={{
          backgroundImage: `url(${imageURL})`,
          backgroundSize: "cover", // Use cover to fill the space
          backgroundPosition: "center", // Center the image
          backgroundRepeat: "no-repeat", // Prevent the background from repeating
          width: "300px", // Fill the parent container
          height: "300px", // Set a fixed height for the anchor tag
          display: "block", // Make it a block element
          textDecoration: "none", // Remove underline from the link text
          position: "relative", // Allows positioning of child elements
          border: "1px solid #ccc", // Optional: border for the card
          borderRadius: "10px", // Optional: rounded corners
          overflow: "hidden", // Prevents overflow of content
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            backgroundColor: "#282c34", // Semi-transparent background for readability
            padding: "30px", // Padding for the content
            display: "flex", // Flexbox to align items
            justifyContent: "space-between", // Space between title and username
            color: "white", // Text color
          }}
        >
          <span
            style={{
              position: "absolute", // Position relative to the anchor
              bottom: "1px", // Adjust as needed for vertical position
              left: "200px", // Align to the left of the card
              color: "white", // Text color
              backgroundColor: "#282c34", // Semi-transparent background for readability
              padding: "5px", // Padding around the text
              borderRadius: "5px", // Optional: rounded corners for the title background
            }}
          >
            {date}
          </span>
          <span
            style={{
              position: "absolute", // Position relative to the anchor
              bottom: "10px", // Adjust as needed for vertical position
              left: "10px", // Align to the left of the card
              color: "white", // Text color
              backgroundColor: "#282c34", // Semi-transparent background for readability
              padding: "5px", // Padding around the text
              borderRadius: "5px", // Optional: rounded corners for the title background
            }}
          >
            {truncateText(title, 20)}
          </span>
          <span
            style={{
              position: "absolute", // Position relative to the anchor
              bottom: "25px", // Adjust as needed for vertical position
              right: "10px", // Align to the left of the card
              color: "white", // Text color
              backgroundColor: "#282c34", // Semi-transparent background for readability
              padding: "5px", // Padding around the text
              borderRadius: "5px", // Optional: rounded corners for the title background
            }}
          >
            {truncateText(userName, 20)}
          </span>
        </div>
      </a>
    </li>
  );
};

export default GameCard;
