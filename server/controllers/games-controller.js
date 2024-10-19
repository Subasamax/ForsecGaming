// Import database
const knex = require("./../db");
const dotenv = require("dotenv");
const resetTokens = require("./resetTokens"); // Adjust the path as necessary
dotenv.config();
const { OAuth2Client } = require("google-auth-library");
const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID); // might not need

// Retrieve all games
exports.gamesAll = async (req, res) => {
  try {
    // Get all games from the database
    const userData = await knex
      .select("id", "author", "title", "pubDate", "rating", "description") // Specify all fields except 'author_ID'
      .from("games");

    // Send the processed data as JSON response
    res.status(200).json(userData);
  } catch (err) {
    // Send an error message in response
    res
      .status(500)
      .json({ message: `There was an error retrieving games: ${err.message}` });
  }
};

// Create new game --- Reuses code, needs to be refactored
exports.GamesCreate = async (req, res) => {
  // Add new game to database
  var id_token = req.cookies.id_token; // grabs access_token
  const refresh_token = req.cookies.refresh_token;
  if (
    (!id_token && !refresh_token) ||
    (id_token === "undefined" && refresh_token == "undefined")
  ) {
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
      id_token = response.credentials.id_token;
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
  knex("games")
    .insert({
      // insert new  game
      author: userData.name, // unique identifyer for author
      author_ID: userData.sub,
      title: req.body.title, // Title
      pubDate: new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
      rating: 0, // initial to 0
      description: req.body.description,
    })
    .returning("id")
    .then((ids) => {
      // Send a success message in response
      res.status(200).json({
        id: ids[0].id,
        message: `Game \'${req.body.title}\' by ${userData.name} created.`,
      });
    })
    .catch((err) => {
      // Send a error message in response
      res.status(404).json({
        message: `There was an error creating ${req.body.title} game: ${err}`,
      });
    });
};

// Remove specific game
exports.gameDelete = async (req, res) => {
  // Find specific game in the database and remove it
  knex("games")
    .where("id", req.body.id) // find correct record based on id
    .del() // delete the record
    .then(() => {
      // Send a success message in response
      res.json({ message: `Game ${req.body.id} deleted.` });
    })
    .catch((err) => {
      // Send a error message in response
      res.json({
        message: `There was an error deleting ${req.body.id} game: ${err}`,
      });
    });
};

// Remove all games on the list
exports.gamesReset = async (req, res) => {
  // Remove all games from database
  knex
    .select("*") // select all records
    .from("games") // from 'games' table
    .truncate() // remove the selection
    .then(() => {
      // Send a success message in response
      res.json({ message: "game list cleared." });
    })
    .catch((err) => {
      // Send a error message in response
      res.json({ message: `There was an error resetting game list: ${err}.` });
    });
};
