// auth_rt.js
// Main router for user authentication backend, HTML rendering, and token handling (access/refresh).

// Core modules
const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

// Third-party modules
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt"); // Import bcrypt for hashing passwords
require("dotenv").config(); // Load environment variables


// Custom middleware
const verifyLogin = require("../middleware/verifyLogin");
const verifyCartAccessToken = require("../middleware/verifyCartAccessToken");

// Create a new router object
const router = express.Router();

// Middleware setup
router.use(express.static(path.join(__dirname, "public"))); // Serve static files
router.use(cookieParser()); // Parse cookies in request headers

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Token generation functions
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
}

// Calculate time remaining for token expiration
function calculateTimeRemaining(timeInSecondsLeft) {
  const days = Math.floor(timeInSecondsLeft / (24 * 60 * 60));
  const hours = Math.floor((timeInSecondsLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeInSecondsLeft % (60 * 60)) / 60);
  const seconds = timeInSecondsLeft % 60;
  return { days, hours, minutes, seconds };
}

// Routes

// Main authentication page
router.route("/")
  .get(verifyLogin, verifyCartAccessToken, (req, res) => {
    if (req.isLoggedIn) {
      console.log("Already logged in! Redirecting to profile.");
      return res.redirect("/myprofile");
    }

    const loggedIn = req.isLoggedIn;
    const cart = req.cart;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    res.render("auth", {
      title: "Login/Register",
      siteName: "Worst Buy",
      loggedIn,
      totalItems,
    });
  });

// Token status route
router.route("/token_status")
  .get((req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    try {
      const accessTokenPayload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, { complete: true });
      const refreshTokenPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, { complete: true });
      const currentTime = Math.floor(Date.now() / 1000);
      const accessTokenSecondsLeft = accessTokenPayload.payload.exp ? accessTokenPayload.payload.exp - currentTime : 0;
      const refreshTokenSecondsLeft = refreshTokenPayload.payload.exp ? refreshTokenPayload.payload.exp - currentTime : 0;

      const accessTokenTimeRemaining = calculateTimeRemaining(accessTokenSecondsLeft);
      const refreshTokenTimeRemaining = calculateTimeRemaining(refreshTokenSecondsLeft);

      const accessExpirationText = `Auth Access Token Expires In: ${accessTokenTimeRemaining.days} days ${accessTokenTimeRemaining.hours} hours ${accessTokenTimeRemaining.minutes} minutes ${accessTokenTimeRemaining.seconds} seconds`;
      const refreshExpirationText = `Auth Refresh Token Expires In: ${refreshTokenTimeRemaining.days} days ${refreshTokenTimeRemaining.hours} hours ${refreshTokenTimeRemaining.minutes} minutes ${refreshTokenTimeRemaining.seconds} seconds`;

      console.log(accessExpirationText);
      console.log(refreshExpirationText);

      res.status(200).json({
        accessExpiration: accessExpirationText,
        refreshExpiration: refreshExpirationText,
      });
    } catch (err) {
      console.log("Invalid Auth token(s). Cannot check token status. (/token_status:GET)");
      res.status(201).json({ message: "Invalid Auth token(s). Cannot check token status." });
    }
  });

// Token restart route
router.route("/restart_token")
  .post(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try { // Try to verify the refresh token
      const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); // Verify the refresh token
      const accessToken = req.cookies.accessToken; // Get the access token

      try { // Try to verify the access token
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET); // Verify the access token
        console.log("Auth Access token is still valid, no action taken. (/restart_token:POST)");
        return res.status(200).json({ message: "Auth Access token is still valid." }); // Access token is still valid
      } catch (err) { // If access token is invalid
        const newAccessToken = generateAccessToken({ email: user.email });
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1 * 60 * 1000,
        });

        console.log("Auth Access token refreshed. (/restart_token:POST)");
        res.status(202).json({ message: "Auth Access token refreshed." });
      }
    } catch (err) { // If refresh token is invalid
      console.log("Invalid Auth refresh token. Cannot refresh access token.(/restart_token:POST)");
      res.status(203).json({ message: "Re-login required to refresh Auth access token." });
    }
  })
  .get(verifyLogin, (req, res) => {
    if (req.isLoggedIn) {
      const accessToken = req.cookies.accessToken;
      console.log("User data retrieved.");
      res.status(200).json({ user: jwt.decode(accessToken) });
    } else {
      console.log("No valid Auth access token. Cannot receive user data. (/restart_token:GET)");
      res.status(201).json({ message: "Not logged in. Cannot receive user data." });
    }
  });

// Login request route
router.route("/login_request")
  .post(async (req, res) => {
    const { email, password } = req.body; // Get email and password from request body

    try {

      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      if (rows.length <= 0) { //no user found in database
        return res.status(401).json({ message: "Account not registered" });
      }

      const user = rows[0]; // Get the first user from the results (object that has attributes email and password)

      // Compare the hashed password with the input password
      const correctPassword = await bcrypt.compare(password, user.password);
      if (!correctPassword) {
        return res.status(401).json({ message: "Wrong password" });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1 * 60 * 1000,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });

      console.log("Login successful!");
      res.status(200).json({ message: "Login successful!" });

    } catch (error) {
      console.error("Database error: ", error);
      res.status(500).json({ message: "Database error" });
    }
  });

// Register request route
router.route("/register_request")
  .post(async (req, res) => {
    const { email, password } = req.body;

    try {
      const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
        return res.status(409).json({ message: "Email already registered" });
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);
      console.log("User registered and password encrypted.");
      res.status(200).json({ message: "Registration successful!" });

    } catch (error) {
      console.error("Database error: ", error);
      res.status(500).json({ message: "Database error" });
    }
  });


  // request reset password

module.exports = router;
