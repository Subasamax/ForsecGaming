// Import dependencies
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

// Import routes
const gamesRouter = require("./routes/games-route");
const staticRouter = require("./routes/static_route");
const userRouter = require("./routes/user_routes");
const authRouter = require("./routes/oauth");
const requestRouter = require("./routes/request");
const uploadRouter = require("./routes/upload_route");

const PORT = process.env.PORT || 3001;

const app = express();
// Apply middleware
// Middleware
const corsOptions = {
  origin: "http://localhost:3000", // Your frontend origin
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));

app.use(helmet());
app.use(compression());
app.use(cookieParser());

// built-in body parsers for express
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

// Implement routes
app.use("/users", userRouter);
app.use("/oauth", authRouter);
app.use("/request", requestRouter);
app.use("/upload", uploadRouter);

// route to serve static files for the games
app.use("/:gameName/static", (req, res, next) => {
  req.gameName = req.params.gameName; // set gameName for the static router
  res.setHeader("Cross-Origin-Resource-Policy", "same-site"); // or 'same-site' if appropriate
  staticRouter(req, res, next); // Call static router
});

// Set custom Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    // allows frames for self
    "Content-Security-Policy",
    "frame-ancestors 'self' http://localhost:3000;"
  );
  next(); // sends to next route
});

app.use("/games", gamesRouter);

// Implement 500 error route
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send("Something is broken.");
});

// Implement 404 error route
app.use((_req, res, _next) => {
  res.status(404).send("Sorry we could not find that.");
});

// Start express app
app.listen(PORT, function () {
  console.log(`Server is running on: ${PORT}`);
});
