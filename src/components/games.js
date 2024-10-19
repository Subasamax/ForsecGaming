import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const Games = () => {
  const { gameID } = useParams();
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

  const toggleFullScreen = () => {
    const iframe = iframeRef.current;
    // handleStartAudio();
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

  // const handleStartAudio = () => {
  //   const iframeWindow = iframeRef.current.contentWindow;
  //   if (iframeWindow) {
  //     iframeWindow.postMessage("startAudio", "http://localhost:3000");
  //   }
  // };

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
  const imageURL = `http://localhost:3001/${gameID}/static/photo`;

  return (
    <div style={styles.container}>
      <h1
        style={{
          color: "white",
        }}
      >
        Tetris
      </h1>
      <iframe
        ref={iframeRef}
        src={`http://localhost:3001/games/${gameID}/play`} // Updated URL
        title="tetris"
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
          fontSize: "30px",
          cursor: "pointer",
          background: "transparent",
          border: "none", // Remove the border
          outline: "none", // Remove the outline
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
