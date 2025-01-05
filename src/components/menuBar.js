// src/MenuBar.js

import React, { useEffect, useState } from "react";
import "./../css/MenuBar.css";
import { Link } from "react-router-dom";

function navigate(url) {
  window.location.href = url; // goes to url
}

async function auth() {
  const response = await fetch("http://localhost:3001/request", {
    // backend request route
    method: "post",
  });
  const data = await response.json(); // gets url for auth request
  console.log(data);
  navigate(data.url); // navigates to url
}

const MenuBar = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Check if user is logged in (you might check cookies, localStorage, etc.)
    getData();
  }, []);

  async function getData() {
    const response = await fetch("http://localhost:3001/users/data", {
      // backend request route
      method: "get",
      credentials: "include", // Important for sending cookies
    });
    if (!response.ok) {
      setUser(null);
      return;
    }
    const data = await response.json(); // gets url for auth request
    if (!data.success) {
      setUser(null);
      return;
    }
    setUser(data);
  }

  async function logOut() {
    const response = await fetch("http://localhost:3001/users/logout", {
      // backend request route
      method: "get",
      credentials: "include", // Important for sending cookies
    });
    if (!response.ok) {
      console.error("there was an error logging out");
      return;
    }
  }

  return (
    <div className="menu-bar">
      {/* placeholder title */}
      <img className="titleImage" src="/ForsecGamingHeader2.png" alt="Header" />
      <nav>
        <ul className="menu">
          <button className="btn btn-outline-dark button">
            <Link className="link" to="/">
              Home
            </Link>
          </button>
          <button className="btn btn-outline-dark button">
            <Link className="link" to="/publish">
              Publish Game
            </Link>
          </button>
          <button className="btn btn-outline-dark button">
            <Link className="link" to="/games">
              Games
            </Link>
          </button>
          <li>
            {user ? (
              <div>
                <button
                  className="btn btn-outline-dark logOut"
                  onClick={() => {
                    logOut();
                    setUser(null); // Clear user data
                  }}
                >
                  Logout
                </button>
                <img
                  src={user.picture}
                  alt="Profile"
                  style={{
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                  }}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop if the fallback fails
                    console.log(e);
                  }}
                />
                {/* Add more user-specific content here */}
              </div>
            ) : (
              <div>
                <button
                  className="btn btn-outline-dark button"
                  onClick={() => auth()}
                >
                  Login
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MenuBar;

//      <h1 className="site-title">ForsecGaming</h1>
