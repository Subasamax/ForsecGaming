import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./../css/games.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Games = () => {
  const { gameID } = useParams();
  const [Title, setTitle] = useState([]); // State to hold the games data
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleResize = (event) => {
      if (iframeRef.current) {
        iframeRef.current.style.height = `${event.data}px`; // Set iframe height
      }
    };

    window.addEventListener("message", handleResize);

    return () => {
      window.removeEventListener("message", handleResize); // Clean up
    };
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`http://localhost:3001/games/${gameID}`); // Adjust the URL as needed
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`Network response was not ok, ${data.message}`);
        }
        setTitle(data[0].title);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGames(); // Call the fetch function
  }, [Title, gameID]);

  const toggleFullScreen = () => {
    const iframe = iframeRef.current;
    if (!document.fullscreenElement) {
      iframe.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      textAlign: "center",
      background: "#282c34",
    },
    iframe: {
      width: "100%", // Adjust as necessary
      height: "60vh", // Adjust as necessary
      border: "none",
    },
  };

  return (
    <div style={styles.container}>
      <h1 className="gamestitle">{Title}</h1>
      <hr className="gameDivider"></hr>
      <iframe
        ref={iframeRef}
        src={`http://localhost:3001/games/${gameID}/play`} // Updated URL
        title={Title}
        allow="autoplay"
        style={{
          width: "35%",
          height: "50vh",
          border: "none",
        }}
      />
      <button
        onClick={toggleFullScreen}
        style={{
          marginBottom: "10px",
          fontSize: "50px",
          cursor: "pointer",
          background: "transparent",
          border: "none", // Remove the border
          outline: "none", // Remove the outline
          position: "relative",
          top: "-80px",
          right: "-13%",
        }}
      >
        <i className="bi bi-fullscreen" style={{ marginRight: "5px" }}></i>
      </button>
    </div>
  );
};

export default Games;

//https://github.com/porkopek/react-tetris
//
// <iframe
// ref={iframeRef}
//

// title="Tetris"
// />
