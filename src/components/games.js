import React, { useEffect, useRef } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Games = () => {
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
      height: "60vh",
      textAlign: "center",
    },
    iframe: {
      width: "150%", // Adjust as necessary
      height: "60vh", // Adjust as necessary
      border: "none",
    },
  };
  return (
    <div style={styles.container}>
      <h1>Tetris</h1>
      <iframe
        ref={iframeRef}
        src={`http://localhost:3001/games/play/Tetris`} // Updated URL
        title="tetris"
        style={{
          width: "200%",
          height: "100vh",
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
