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

// Serve static files (JS, CSS, images) from the specific game's directory
// router.use("/play/:gameName", (req, res, next) => {
//   const gameName = req.params.gameName;
//   const direct = path.join(__dirname, "/../published", gameName);
//   console.log(direct);
//   express.static(direct)(req, res, next);
// });

// Catch-all for static files without needing the /play/:gameName prefix
router.use("/play/:gameName/static/*", (req, res, next) => {
  const gameName = req.params.gameName.toLowerCase(); // Ensure case consistency
  const staticDir = path.join(__dirname, "/../published", gameName);
  console.log(staticDir);
  express.static(staticDir)(req, res, next);
});

// Serve the index.html file for a specific game
router.get("/play/:gameName", (req, res) => {
  const gameName = req.params.gameName;
  const gamePath = path.join(__dirname, "/../published", gameName);
  console.log(gameName);

  res.sendFile(path.join(gamePath, "index.html"), (err) => {
    if (err) {
      console.log(err);
      res.status(err.status).send("Game not found");
    }
  });
});

// Export router
module.exports = router;
