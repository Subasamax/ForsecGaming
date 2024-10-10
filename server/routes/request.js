var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { OAuth2Client } = require("google-auth-library");

router.post("/", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectUrl = "http://localhost:3001/oauth"; // redirects to server oauth route

  const oAuth2Client = new OAuth2Client( // google auth client object
    process.env.CLIENT_ID, // client id
    process.env.CLIENT_SECRET, // client secret
    redirectUrl // url
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "profile openid",
    prompt: "consent",
    state: process.env.STATE,
  });

  res.json({ url: authorizeUrl }); // sends url to frontend
});

module.exports = router;

// https://www.youtube.com/watch?v=17xwTuidqZw
