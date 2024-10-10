// Import express
const express = require("express");

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
// Export router
module.exports = router;
