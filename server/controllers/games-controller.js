// Import database
const knex = require("./../db");

// Retrieve all games
exports.gamesAll = async (req, res) => {
  try {
    // Get all games from the database
    const userData = await knex
      .select("*") // Select all records
      .from("games"); // From 'games' table

    // Process the data
    const processedData = userData.map((game) => {
      if (game.image) {
        // Convert binary image to Base64 string if image exists
        return {
          ...game, // Spread operator to copy all properties
          image: game.image.toString("base64"), // Convert binary to Base64
        };
      }
      return game; // Return game without modification
    });

    // Send the processed data as JSON response
    res.json(processedData);
  } catch (err) {
    // Send an error message in response
    res
      .status(500)
      .json({ message: `There was an error retrieving games: ${err.message}` });
  }
};

// Create new game
exports.GamesCreate = async (req, res) => {
  // Add new game to database
  knex("games")
    .insert({
      // insert new  game
      author: req.body.author,
      title: req.body.title,
      pubDate: req.body.pubDate,
      rating: req.body.rating,
      image: atob(req.body.image), // converts base64 string to binary
    })
    .then(() => {
      // Send a success message in response
      res.json({
        message: `Game \'${req.body.title}\' by ${req.body.author} created.`,
      });
    })
    .catch((err) => {
      // Send a error message in response
      res.json({
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
