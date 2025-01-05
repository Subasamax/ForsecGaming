// Import express
const express = require("express");
const path = require("path");
const fs = require("fs");

// Import games-controller
const gamesRoutes = require("./../controllers/games-controller.js");

// Create router
const router = express.Router();

// Add route for GET request to retrieve all games
// In server.js, games route is specified as '/games'
// this means that '/all' translates to '/games/all'
router.get("/all", (req, res) => {
  gamesRoutes.gamesAll(req, res);
});

// Add route for POST request to create new game
// In server.js, games route is specified as '/games'
// this means that '/create' translates to '/games/create'
router.post("/create", (req, res) => {
  gamesRoutes.GamesCreate(req, res);
});
// Add route for PUT request to delete specific game
// In server.js, games route is specified as '/games'
// this means that '/delete' translates to '/games/delete'
router.put("/delete", (req, res) => {
  gamesRoutes.gameDelete(req, res);
});
// Add route for PUT request to reset gameshelf list
// In server.js, games route is specified as '/games'
// this means that '/reset' translates to '/games/reset'
router.put("/reset", (req, res) => {
  gamesRoutes.gamesReset(req, res);
});

router.post("/review", (req, res) => {
  gamesRoutes.gamesReview(req, res);
});

// get individual game data
router.get("/:gameName", (req, res) => {
  gamesRoutes.getGame(req, res);
});

// Catch-all for static files without needing the /play/:gameName prefix
router.use("/play/:gameName/static/*", (req, res, next) => {
  const gameName = req.params.gameName.toLowerCase(); // Ensure case consistency
  const staticDir = path.join(__dirname, "/../published/games", gameName);
  express.static(staticDir)(req, res, next);
});

// Serve the index.html file for a specific game
router.get("/:gameName/play", (req, res) => {
  const gameName = req.params.gameName;
  const gamePath = path.join(__dirname, "/../published/games", gameName);

  res.sendFile(path.join(gamePath, "index.html"), (err) => {
    if (err) {
      console.log(err);
      res.status(err.status).send("Game not found");
    }
  });
});

// Serve the index.html file for a specific game
// another route to server static files depending on the index html
router.get("/:gameName/*", (req, res) => {
  const gameName = req.params.gameName.toLowerCase(); // Ensure case consistency
  const staticDir = path.join(
    __dirname,
    "/../published/games",
    gameName,
    req.params[0]
  );
  res.setHeader("Cross-Origin-Resource-Policy", "same-site"); // or 'same-site' if appropriate
  // Check if the file exists
  fs.stat(staticDir, (err) => {
    if (err) {
      // checks for err
      if (err.code === "ENOENT") {
        // checks to see if the file exists at specified path, file not found
        return res.status(404).send("Photo not found"); // sends back 404 response
      }
      // Some other error occurred
      console.error(err); // log error
      res.status(404).send(`Error: ${err}`);
    }
    // file exists so send it
    res.sendFile(staticDir);
  });
  return;
});

// Export router
module.exports = router;
