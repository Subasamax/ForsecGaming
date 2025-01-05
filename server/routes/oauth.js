var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { OAuth2Client } = require("google-auth-library");

async function getUserData(access_token) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    // error
    console.error("Failed to get user data:", err);
    return {
      success: false,
      message: err,
    };
  }
}

// basic oauth route
router.get("/", async function (req, res, next) {
  const code = req.query.code;
  const state = req.query.state;
  // Verify the state
  if (state !== process.env.STATE) {
    console.log("error in state");
    const frontendUrl = `http://localhost:3000/error?message=State mismatch. Please try again.`;
    return res.redirect(frontendUrl); // redirect
  }
  try {
    // try to do oauth
    const redirectUrl = "http://localhost:3001/oauth";
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );
    const response = await oAuth2Client.getToken(code); // get tokens from code
    await oAuth2Client.setCredentials(response.tokens); // set the credentials using the tokens
    //console.log("tokens acquired");
    const user = oAuth2Client.credentials; // get the credentials
    res.cookie("refresh_token", user.refresh_token, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "Strict", // Protect against CSRF, makes sure cookies are only sent to same site requests
      maxAge: 1209600000, // Set the cookie to expire in 14 days (adjust as needed)
    });
    res.cookie("id_token", user.id_token, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "Strict", // Protect against CSRF, makes sure cookies are only sent to same site requests
      maxAge: 3600000, // Set the cookie to expire in 1 hour (adjust as needed)
    });
    // gets the user data, Might replace later with another function to not use the access token
    const userData = await getUserData(user.access_token);
    try {
      const response = await fetch("http://localhost:3001/users/exists", {
        // checks if exists
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sub: userData.sub }),
      });
      if (!response.ok) {
        // error
        console.log("failled to check if user exists");
      }
      const exists = await response.json();

      if (!exists.exists) {
        // checks if exists
        const response = await fetch("http://localhost:3001/users/create", {
          // if not creates user
          method: "POST", // post
          headers: {
            // appplication json
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // sets body attributes
            sub: userData.sub,
            name: userData.name,
            given_name: userData.given_name,
            picture: userData.picture,
          }),
        });
        if (!response.ok) {
          // error handling in future
          console.log("failled to create user");
        }
      }
    } catch (err) {
      // catch error
      console.error("Failed to get user data:", err);
    }

    const frontendUrl = `http://localhost:3000/`; // home url
    res.redirect(frontendUrl); // redirects back to home
  } catch (err) {
    console.error("Failed to process:", err);
  }
});

module.exports = router;
