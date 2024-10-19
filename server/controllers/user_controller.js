// Import database
const knex = require("./../db");
const dotenv = require("dotenv");
const resetTokens = require("./resetTokens"); // Adjust the path as necessary
dotenv.config();
const { OAuth2Client } = require("google-auth-library");
const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID); // might not need

async function getUserData(access_token) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );
    if (!response.ok) {
      const errorData = await response.json();
      return json({
        success: false,
        error: errorData.error || "An error occurred while fetching user info.",
      });
    }
    const userData = await response.json();
    return {
      success: true,
      data: userData,
    };
  } catch (err) {
    console.error("Failed to get user data:", err);
  }

  // error checking here later!!
}

// Retrieve all games
exports.userAll = async (req, res) => {
  try {
    // Get all games from the database
    const userData = await knex
      .select("*") // Select all records
      .from("users"); // From 'games' table

    // Send the user data as JSON response
    res.json(userData);
  } catch (err) {
    // Send an error message in response
    res
      .status(500)
      .json({ message: `There was an error retrieving games: ${err.message}` });
  }
};

// Create new user
exports.userCreate = async (req, res) => {
  // Add new user to database
  knex("users")
    .insert({
      // insert new  user
      sub: req.body.sub,
      name: req.body.name,
      given_name: req.body.given_name,
      picture: req.body.picture,
    })
    .then(() => {
      // Send a success message in response
      res.json({
        message: `User \'${req.body.name}\' created.`,
      });
    })
    .catch((err) => {
      // Send a error message in response
      res.json({
        message: `There was an error creating ${req.body.name} user`,
      });
    });
};

// Remove specific game
exports.userDelete = async (req, res) => {
  // Find specific game in the database and remove it
  knex("users")
    .where("sub", req.body.sub) // find correct record based on id
    .del() // delete the record
    .then(() => {
      // Send a success message in response
      res.json({ message: `User ${req.body.name} deleted.` });
    })
    .catch((err) => {
      // Send a error message in response
      res.json({
        message: `There was an error deleting ${req.body.name} user. Error: ${err}`,
      });
    });
};

// Remove all users on the list
exports.userReset = async (req, res) => {
  // Remove all users from database
  knex
    .select("*") // select all records
    .from("user") // from 'users' table
    .truncate() // remove the selection
    .then(() => {
      // Send a success message in response
      res.json({ message: "user list cleared." });
    })
    .catch((err) => {
      // Send a error message in response
      res.json({ message: `There was an error resetting user list: ${err}.` });
    });
};

// Remove specific game
exports.userExists = async (req, res) => {
  // Find specific user in the database
  const query = await knex("users")
    .select("*") // select all records
    .from("users") // from 'users' table
    .where("sub", req.body.sub) // find correct record based on id
    .count("* as count")
    .catch((err) => {
      // Send a error message in response
      res.json({
        exists: false,
        message: `Error: ${err}`,
      });
    });
  const count = query[0].count;
  if (count == 0) {
    return res.json({
      exists: false,
    });
  } else {
    return res.json({
      exists: true,
    });
  }
};

// update specific user
exports.userUpdate = async (req, res) => {
  // Find specific user in the database and update it
  knex("users")
    .select("*") // select all records
    .from("users") // from 'users' table
    .where("sub", req.body.sub) // find correct record based on id
    .update({
      name: req.body.name,
      given_name: req.body.given_name,
      picture: req.body.picture,
    }) // update the record
    .then(() => {
      // Send a success message in response
      res.json({ Message: "update successful" });
    })
    .catch((err) => {
      // Send a error message in response
      res.json({
        message: `Update failed. Error: ${err}`,
      });
    });
};

// update specific user
exports.userData = async (req, res) => {
  // Find specific user in the database and update it
  var id_token = req.cookies.id_token; // grabs access_token
  const refresh_token = req.cookies.refresh_token;

  if (
    (!id_token && !refresh_token) ||
    (id_token === "undefined" && refresh_token == "undefined")
  ) {
    console.log("get");
    return res // error res
      .status(401)
      .json({ message: "ID and refresh token is missing." });
  } else if (!id_token && refresh_token) {
    // else refresh token still is good
    const response = await resetTokens(refresh_token); // resets tokens
    if (response.success) {
      res.cookie("access_token", response.credentials.access_token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "Strict", // Protect against CSRF, makes sure cookies are only sent to same site requests
        maxAge: 3600000, // Set the cookie to expire in 1 hour (adjust as needed)
      });
      res.cookie("refresh_token", response.credentials.refresh_token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "Strict", // Protect against CSRF, makes sure cookies are only sent to same site requests
        maxAge: 1209600000, // Set the cookie to expire in 14 days (adjust as needed)
      });
      res.cookie("id_token", response.credentials.id_token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "Strict", // Protect against CSRF, makes sure cookies are only sent to same site requests
        maxAge: 3600000, // Set the cookie to expire in 1 hour (adjust as needed)
      });
      id_token = response.credentials.idToken;
    } else {
      return res.status(401).json({
        message: `Need to log in again!`,
      }); // need to log in again
    }
  }
  var userData;
  try {
    const userTicket = await oAuth2Client.verifyIdToken({
      idToken: id_token,
      audience: process.env.CLIENT_ID,
    });
    const userInfo = userTicket.getPayload();
    userData = userInfo;
  } catch (err) {
    console.log(`There was an error getting ID token. Error: ${err}`);
    return res.status(401).json({
      message: `There was an error getting ID token. Error: ${err}`,
    });
  }

  // if (!userData.success) {
  //   // checks if valid
  //   return res.status(401).json({
  //     success: false,
  //     error: userData.error,
  //   });
  // }

  try {
    await knex("users")
      .where("sub", userData.sub) // find correct record based on id
      .update({
        name: userData.name,
        given_name: userData.given_name,
        picture: userData.picture,
      }); // update the record
  } catch (err) {
    return res.json({
      success: false,
      message: `Update failed. Error: ${err}`,
    });
  }

  res.status(200).json({
    success: true,
    name: userData.name,
    given_name: userData.given_name,
    picture: userData.picture,
  });
};

// update specific user
exports.userLogout = async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true, // Ensures the cookie is HTTP-only
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict", // Adjust as needed (Lax or None for cross-site)
  });

  // Optionally clear any other cookies
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  // Optionally clear any other cookies
  res.clearCookie("id_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.json({
    message: "Logged out Successfuly",
  });
};
