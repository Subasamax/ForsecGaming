const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// grabs and serves photo files
router.use("", async (req, res, next) => {
  const gameName = req.gameName; // Gets gameName
  const staticPhoto = path.join(
    __dirname,
    "/../published/photos",
    gameName + ".png"
  ); // gets static directory
  // Check if the file exists
  res.sendFile(staticPhoto);
  return;
  await fs.stat(staticPhoto, (err) => {
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
