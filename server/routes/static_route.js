const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.use("/photo", (req, res, next) => {
  const gameName = req.gameName; // Gets gameName
  const staticPhoto = path.join(
    __dirname,
    "/../published/photos",
    gameName + ".png"
  ); // gets static directory
  // Check if the file exists
  fs.stat(staticPhoto, (err) => {
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
    res.sendFile(staticPhoto);
  });
});

// Catch-all for static files without needing the /play/:gameName prefix
router.use("", (req, res, next) => {
  const gameName = req.gameName; // Gets gameName
  const staticDir = path.join(
    __dirname,
    "/../published/games",
    gameName,
    "static"
  ); // gets static directory
  express.static(staticDir)(req, res, (err) => {
    // try to get serve static files
    if (err) {
      // checks for err
      console.error(err); // logs
      // Check if the error is a 404
      if (err.status === 404) {
        return res.status(404).send("Static file not found");
      }
      return next(err); // Pass unkown errors to the default error handler
    }
  });
});

// catches all other paths/errors
router.use("*", (req, res, next) => {
  res.status(404).send("Route not found");
});

module.exports = router;
