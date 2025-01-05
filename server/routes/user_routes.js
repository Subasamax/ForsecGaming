// Import express
const express = require("express");

// Import games-controller
const userRoutes = require("./../controllers/user_controller.js");

// Create router
const router = express.Router();

// Add route for GET request to retrieve all games
// In server.js, games route is specified as '/games'
// this means that '/all' translates to '/games/all'
router.get("/all", (req, res) => {
  userRoutes.userAll(req, res);
});

// Add route for POST request to create new game
// In server.js, games route is specified as '/games'
// this means that '/create' translates to '/games/create'
router.post("/create", (req, res) => {
  userRoutes.userCreate(req, res);
});
// Add route for PUT request to delete specific game
// In server.js, games route is specified as '/games'
// this means that '/delete' translates to '/games/delete'
router.put("/delete", (req, res) => {
  userRoutes.userDelete(req, res);
});
// Add route for PUT request to reset gameshelf list
// In server.js, games route is specified as '/games'
// this means that '/reset' translates to '/games/reset'
router.put("/reset", (req, res) => {
  userRoutes.userReset(req, res);
});

// checks if user exists
router.put("/exists", (req, res) => {
  userRoutes.userExists(req, res);
});

// updates user
router.put("/update", (req, res) => {
  userRoutes.userUpdate(req, res);
});

// gets data
router.get("/data", (req, res) => {
  userRoutes.userData(req, res);
});

// logs user out
router.get("/logout", (req, res) => {
  userRoutes.userLogout(req, res);
});

// Export router
module.exports = router;
