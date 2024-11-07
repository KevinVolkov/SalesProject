//***root_rt.js is the main router for the home page backend, its HTML rendering,
//*** and its necessary access/refresh tokens (if any).

// Core modules
const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

// Third-party modules
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Imported custom middleware
const verifyCartAccessToken = require("../middleware/verifyCartAccessToken.js");
const verifyLogin = require("../middleware/verifyLogin.js");

// Create a new router object
const router = express.Router();

// Middleware setup
router.use(express.static(path.join(__dirname, "public")));
router.use(cookieParser());

//** Database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Routes

// Root page route
router.route("/").get(verifyLogin, verifyCartAccessToken, (req, res) => {
  const loggedIn = req.isLoggedIn; // Get the 'req.isLoggedIn' from middleware
  const cart = req.cart; // Get the 'req.cart' from middleware
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Calculate total items in cart

  res.render("root", {
    title: "Home",
    siteName: "Worst Buy", // (header.ejs)
    loggedIn, // (header.ejs)
    totalItems, // (header.ejs)
  });
});

// Export the router object
module.exports = router;
