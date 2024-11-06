//***myprofile_rt.js is the main router for the user's profile backend, its html rendering,
//*** and its necessary access/refresh tokens (if any).

// Core modules
const express = require("express");
const mysql = require("mysql2/promise");

// third-party modules
const cookieParser = require("cookie-parser");
require("dotenv").config();

//imported custom middleware
const verifyCartAccessToken = require("../middleware/verifyCartAccessToken.js"); // Imported custom middleware
const verifyLogin = require("../middleware/verifyLogin.js"); // Imported custom middleware

// create a new router object
const router = express.Router();

// Middleware setup

router.use(cookieParser());

//** Database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// utility functions

//routes

//router for profile page
// Add this route to fetch user profile
router.route("/").get(verifyLogin, verifyCartAccessToken, async (req, res) => {
  const loggedIn = req.isLoggedIn; // Get the 'req.isLoggedIn' from middleware  
  const user = req.user; // Get the 'req.user' from middleware

  // Verify access token
  if (!loggedIn) {
    //redirect to login page if access token is invalid
    console.log("Invalid access token. Redirecting to auth page.");
    return res.redirect("/auth");
  }

  // Fetch the user's email from the database
  try {
    const [rows] = await pool.query(
      "SELECT is_admin FROM users WHERE email = ?",
      [user.email]
    ); // Fetch both email and is_admin

    if (rows.length > 0) {
      // If user is found
      const isAdmin = rows[0].is_admin; // Get the is_admin status from the database

      //** fields needed to be calculated to render the partial header.ejs view
      const cart = req.cart; // Get the 'req.cart' from middleware
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Calculate total items in cart

      res.render("myprofile", {
        title: "User Profile",
        email: user.email, // Pass the email to the EJS template
        isAdmin: isAdmin, // Pass the is_admin status to the EJS template
        loggedIn: loggedIn, //  (header.ejs)
        totalItems, // (header.ejs)
        siteName: "Worst Buy", // (header.ejs)
      });
    } else {
      console.error("User in Auth token not found in database. Cannot render profile page. (/myprofile:GET)", error);
      return res.status(404).json({ message: "User in Auth token not found in db. Cannot render profile page" });
    }
  } catch (error) {
    console.error("Error accessing db (/myprofile:GET):", error);
    return res.status(500).json({ message: "Error accessing db" });
  }
});

// Route to log out and clear cookies
router.route("/logout").post((req, res) => {
  try {
    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    console.log("Logged out and cookies cleared! (/logout:POST) "); // Log to terminal
    return res.status(200).json({ message: "Logged out and cookies cleared!" });
  } catch (error) {
    console.error("Error clearing cookies (/logout:POST):", error);
    return res
      .status(400)
      .json({ message: "Error clearing cookies. Check status of cookies" });
  }
});

module.exports = router; // Export the router object
